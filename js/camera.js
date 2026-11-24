
// ======================================
// GREEN VISION AI - CAMERA
// ======================================

let cameraStream = null;

let currentImage = null;

// Các thành phần giao diện
const camera = document.getElementById("camera");
const preview = document.getElementById("preview");
const placeholder = document.getElementById("cameraPlaceholder");

const startCameraBtn =
    document.getElementById("startCameraBtn");

const captureBtn =
    document.getElementById("captureBtn");

const stopCameraBtn =
    document.getElementById("stopCameraBtn");

const imageInput =
    document.getElementById("imageInput");

const predictBtn =
    document.getElementById("predictBtn");

// Mở camera
async function startCamera() {

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            throw new Error(
                "Trình duyệt không hỗ trợ camera hoặc trang chưa chạy trên HTTPS/localhost."
            );
        }

        stopCamera();

       
cameraStream = await navigator.mediaDevices.getUserMedia({

    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },

    audio: false

});


        camera.srcObject = cameraStream;

        await camera.play();

        camera.classList.remove("hidden");
        preview.classList.add("hidden");
        placeholder.classList.add("hidden");

        captureBtn.disabled = false;
        stopCameraBtn.disabled = false;

        currentImage = null;
        predictBtn.disabled = true;

        resetResult();

    } catch (error) {

        alert(
            "Không thể mở camera: " + error.message
        );

        console.error(error);
    }
}

// Chụp ảnh từ camera
function captureImage() {

    if (!cameraStream) return;

    const canvas = document.createElement("canvas");

    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        camera,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image = new Image();

    image.src = canvas.toDataURL("image/jpeg", 0.9);

    image.onload = () => {

        currentImage = image;

        preview.src = image.src;

        preview.classList.remove("hidden");

        camera.classList.add("hidden");

        predictBtn.disabled = !wasteModel;
    };
}

// Tắt camera
function stopCamera() {

    if (cameraStream) {

        cameraStream.getTracks().forEach(track => {
            track.stop();
        });

        cameraStream = null;
    }

    camera.srcObject = null;

    captureBtn.disabled = true;
    stopCameraBtn.disabled = true;
}

// Chọn ảnh từ thiết bị
function handleImageUpload(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("Vui lòng chọn tệp hình ảnh!");

        return;
    }

    if (file.size > 15 * 1024 * 1024) {

        alert("Ảnh không được vượt quá 15 MB.");

        return;
    }

    stopCamera();

    const imageURL = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {

        currentImage = image;

        preview.src = imageURL;

        preview.classList.remove("hidden");

        camera.classList.add("hidden");

        placeholder.classList.add("hidden");

        predictBtn.disabled = !wasteModel;

        resetResult();
    };

    image.onerror = () => {
        URL.revokeObjectURL(imageURL);
        alert("Không thể đọc hình ảnh.");
    };

    image.src = imageURL;
}

// Làm mới hình ảnh
function resetCameraView() {

    stopCamera();

    currentImage = null;

    preview.src = "";
    preview.classList.add("hidden");

    camera.classList.add("hidden");

    placeholder.classList.remove("hidden");

    predictBtn.disabled = true;

    imageInput.value = "";

    resetResult();
}
