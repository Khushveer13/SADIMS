import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

DATASET_PATH = r"C:\Users\Dell\Downloads\archive\plantvillage dataset\color"
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "disease_model.keras")
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, "class_names.json")
METRICS_PATH = os.path.join(MODEL_DIR, "evaluation_metrics.json")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS_FROZEN = 5
EPOCHS_FINE = 3

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)
    print("=" * 60)
    print("[SADIMS] Real CNN Model Training (MobileNetV2 Transfer Learning)")
    print("=" * 60)
    
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset path not found: {DATASET_PATH}")

    # Load dataset with 70% Train, 15% Val, 15% Test split
    print("[1/5] Loading and splitting PlantVillage dataset...")
    raw_train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_PATH,
        validation_split=0.30,
        subset="training",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    raw_val_and_test_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_PATH,
        validation_split=0.30,
        subset="validation",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    class_names = raw_train_ds.class_names
    num_classes = len(class_names)
    print(f"Loaded {num_classes} classes: {class_names}")

    # Save class_names.json
    with open(CLASS_NAMES_PATH, "w") as f:
        json.dump(class_names, f, indent=4)
    print(f"Saved class mapping to: {CLASS_NAMES_PATH}")

    # Split val_and_test 50/50 -> 15% val, 15% test
    val_batches = tf.data.experimental.cardinality(raw_val_and_test_ds)
    test_ds = raw_val_and_test_ds.take(val_batches // 2)
    val_ds = raw_val_and_test_ds.skip(val_batches // 2)

    # Data Augmentation & Preprocessing
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.15),
    ])

    train_ds = raw_train_ds.map(lambda x, y: (preprocess_input(data_augmentation(x, training=True)), y))
    val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y))
    test_ds = test_ds.map(lambda x, y: (preprocess_input(x), y))

    train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    test_ds = test_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    # Build CNN Architecture (MobileNetV2 Backbone + Custom Head)
    print("[2/5] Building MobileNetV2 CNN Architecture...")
    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False  # Initial frozen backbone

    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    callbacks = [
        EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True),
        ModelCheckpoint(MODEL_PATH, monitor="val_loss", save_best_only=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.2, patience=2, min_lr=1e-6, verbose=1)
    ]

    print("[3/5] Stage 1: Training Classification Head (Frozen Backbone)...")
    history_frozen = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_FROZEN,
        callbacks=callbacks
    )

    # Stage 2: Controlled Fine-Tuning
    print("[4/5] Stage 2: Controlled Fine-Tuning (Unfreezing top MobileNetV2 layers)...")
    base_model.trainable = True
    # Freeze bottom 100 layers, fine-tune top layers
    for layer in base_model.layers[:100]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    history_fine = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_FINE,
        callbacks=callbacks
    )

    # Save final model
    model.save(MODEL_PATH)
    print(f"Trained model saved successfully to: {MODEL_PATH}")

    # Evaluate on Test Set
    print("[5/5] Evaluating on independent Test Set...")
    y_true = []
    y_pred_probs = []

    for images, labels in test_ds:
        preds = model.predict(images, verbose=0)
        y_true.extend(labels.numpy())
        y_pred_probs.extend(preds)

    y_true = np.array(y_true)
    y_pred_probs = np.array(y_pred_probs)
    y_pred = np.argmax(y_pred_probs, axis=1)

    test_loss, test_acc = model.evaluate(test_ds, verbose=0)
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="weighted")
    cm = confusion_matrix(y_true, y_pred).tolist()

    metrics = {
        "dataset": "PlantVillage Color Leaf Disease Dataset",
        "num_classes": num_classes,
        "classes": class_names,
        "train_accuracy": float(history_fine.history["accuracy"][-1]),
        "val_accuracy": float(history_fine.history["val_accuracy"][-1]),
        "test_accuracy": float(test_acc),
        "test_loss": float(test_loss),
        "precision_weighted": float(precision),
        "recall_weighted": float(recall),
        "f1_score_weighted": float(f1),
        "confusion_matrix": cm
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=4)

    print("=" * 60)
    print("TRAINING AND EVALUATION COMPLETE!")
    print(f"Test Accuracy: {test_acc * 100:.2f}% | F1 Score: {f1:.4f}")
    print(f"Metrics saved to: {METRICS_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    main()
