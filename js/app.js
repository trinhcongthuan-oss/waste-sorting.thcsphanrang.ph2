// ======================================
// GREEN VISION AI - APPLICATION
// ======================================
// Các thành phần giao diện
const resultSection =
    document.getElementById("resultSection");

const resultName =
    document.getElementById("resultName");

const resultIcon =
    document.getElementById("resultIcon");

const resultConfidence =
    document.getElementById("resultConfidence");

const resultDescription =
    document.getElementById("resultDescription");

const probabilityList =
    document.getElementById("probabilityList");

const loading =
    document.getElementById("loading");

// Hiển thị kết quả
function displayResult(predictions) {

    if (!predictions || predictions.length === 0) {
        throw new Error("Không có kết quả nhận diện.");
    }

    const best = predictions[0];

    console.log("===== KIỂM TRA NHẬN DIỆN =====");

    console.table(predictions.map(item => ({
        className: item.className,
        probability: (item.probability * 100).toFixed(2) + "%"
    })));

    console.log("LỚP AI CAO NHẤT:", best.className);

    const info = getWasteInfo(best.className);

    const confidence = best.probability;
    // Hiển thị khu vực kết quả nhận diện
resultSection.classList.remove("hidden");

    // Giữ nguyên phần code còn lại của hàm

    // Kiểm tra độ tin cậy
    if (confidence < CONFIDENCE_THRESHOLD) {

        resultName.textContent = "Chưa xác định rõ";

        resultIcon.textContent = "❓";

        resultConfidence.textContent =
            "Độ tin cậy thấp: " +
            (confidence * 100).toFixed(1) + "%";

        resultDescription.textContent =
            "AI chưa đủ chắc chắn để phân loại vật thể. " +
            "Bạn hãy chụp lại ảnh rõ hơn, đặt vật thể riêng biệt " +
            "và đủ ánh sáng. Không nên tự động phân loại theo kết quả này.";

    } else {

        resultName.textContent = info.name;

        resultIcon.textContent = info.icon;

        resultConfidence.textContent =
            "Độ tin cậy: " +
            (confidence * 100).toFixed(1) + "%";

        resultDescription.textContent = info.description;
    }

    // Hiển thị xác suất các nhóm
    probabilityList.innerHTML = "";

    predictions.forEach(item => {

        const percent =
            (item.probability * 100).toFixed(1);

        const info = getWasteInfo(item.className);

        const row = document.createElement("div");

        row.className = "probability-row";

        const infoRow = document.createElement("div");

        infoRow.className = "probability-info";

        const name = document.createElement("span");

        name.textContent = info.name;

        const value = document.createElement("strong");

        value.textContent = percent + "%";

        infoRow.appendChild(name);

        infoRow.appendChild(value);

        const progress = document.createElement("div");

        progress.className = "progress";

        const fill = document.createElement("div");

        fill.className = "progress-fill";

        fill.style.width = percent + "%";

        progress.appendChild(fill);

        row.appendChild(infoRow);

        row.appendChild(progress);

        probabilityList.appendChild(row);
    });

    // Lưu lịch sử khi AI nhận diện đủ tin cậy
if (confidence >= CONFIDENCE_THRESHOLD) {

    console.log("DỮ LIỆU CHUẨN BỊ LƯU:", {
        bestClass: best.className,
        displayName: info.name,
        confidence: confidence
    });

    saveHistory({
        name: info.name,
        className: best.className,
        confidence: confidence,
        time: new Date().toLocaleString("vi-VN")
    });
}
// ĐÓNG HÀM displayResult() TẠI ĐÂY
}
// Làm mới kết quả
function resetResult() {

    resultSection.classList.add("hidden");

    probabilityList.innerHTML = "";
}

// Bắt đầu nhận diện
async function runPrediction() {

    if (!currentImage) {

        alert("Vui lòng chụp ảnh hoặc chọn ảnh!");

        return;
    }

    if (!wasteModel) {

        alert("Mô hình AI chưa sẵn sàng!");

        return;
    }

    try {

        predictBtn.disabled = true;

        loading.classList.remove("hidden");

        const predictions = await predictWaste(
            currentImage
        );

        displayResult(predictions);

    } catch (error) {

        console.error(error);

        alert("Lỗi nhận diện: " + error.message);

    } finally {

        loading.classList.add("hidden");

        predictBtn.disabled = !currentImage || !wasteModel;
    }
}

// Khởi tạo ứng dụng
async function initializeApp() {

    try {

        await loadWasteModel();

        predictBtn.disabled = !currentImage || !wasteModel;

        console.log("Green Vision AI đã sẵn sàng!");

    } catch (error) {

        console.error("Không thể khởi động AI:", error);

        predictBtn.disabled = true;

    }
}

// Gắn sự kiện
startCameraBtn.addEventListener(
    "click",
    startCamera
);

captureBtn.addEventListener(
    "click",
    captureImage
);

stopCameraBtn.addEventListener(
    "click",
    stopCamera
);

imageInput.addEventListener(
    "change",
    handleImageUpload
);

predictBtn.addEventListener(
    "click",
    runPrediction
);

document.getElementById("resetBtn")
    .addEventListener("click", resetCameraView);

// Khởi động
initializeApp();

// Đăng ký Service Worker
if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register("./sw.js");

            console.log(
                "Service Worker đã đăng ký:",
                registration.scope
            );

        } catch (error) {

            console.error(
                "Không thể đăng ký Service Worker:",
                error
            );

        }

    });
}