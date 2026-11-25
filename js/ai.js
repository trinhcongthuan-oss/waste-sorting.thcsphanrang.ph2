// ==========================================
// GREEN VISION AI - XỬ LÝ MÔ HÌNH AI
// ==========================================

// Biến lưu mô hình
let wasteModel = null;

// Ngưỡng tin cậy ban đầu: 60%
const CONFIDENCE_THRESHOLD = 0.60;


// Thông tin 5 nhóm rác

function getWasteInfo(className) {

    const wasteTypes = {
        Organic: {
            name: "Rác hữu cơ",
            icon: "🍃",
            description: "Thu gom riêng rau, củ, quả và thức ăn thừa. Có thể tận dụng để ủ phân hữu cơ."
        },

        Paper: {
            name: "Rác giấy",
            icon: "📄",
            description: "Thu gom giấy, báo cũ và bìa carton. Nên giữ giấy khô, sạch để thuận tiện tái chế."
        },

        Plastic: {
            name: "Rác nhựa",
            icon: "🧴",
            description: "Thu gom chai nhựa, túi nilon và bao bì nhựa. Nên làm sạch trước khi phân loại."
        },

        Metal: {
            name: "Rác kim loại",
            icon: "🥫",
            description: "Thu gom lon nhôm, vỏ hộp sắt và các vật dụng kim loại có thể tái chế."
        },

        Other: {
            name: "Rác khác",
            icon: "🗑️",
            description: "Phân loại riêng các loại rác không thuộc bốn nhóm trên. Chú ý xử lý vật sắc nhọn và chất thải nguy hại an toàn."
        }
    };

    // Chuẩn hóa tên lớp AI
    const key = String(className || "")
        .trim()
        .split(" - ")[0]
        .trim();

    return wasteTypes[key] || {
        name: className,
        icon: "❓",
        description: "Chưa có hướng dẫn cho nhóm rác này."
    };
}



// ==========================================
// 1. NẠP MÔ HÌNH AI
// ==========================================

async function loadWasteModel() {

    const status = document.getElementById("modelStatus");

    try {

        if (status) {
            status.textContent = "Đang tải mô hình AI...";
        }

        if (typeof tf === "undefined") {
            throw new Error("Không tìm thấy TensorFlow.js.");
        }

        if (typeof tmImage === "undefined") {
            throw new Error("Không tìm thấy thư viện Teachable Machine.");
        }

        await tf.ready();

        wasteModel = await tmImage.load(
            "./model/waste/model.json",
            "./model/waste/metadata.json"
        );

        console.log("Đã tải mô hình AI thành công");

        console.log(
            "Các lớp nhận diện:",
            wasteModel.getClassLabels()
        );

        if (status) {
            status.textContent = "Mô hình AI đã sẵn sàng!";
        }

        return true;

    } catch (error) {

        wasteModel = null;

        if (status) {
            status.textContent = "Không thể tải mô hình AI!";
        }

        console.error("Lỗi tải mô hình:", error);

        throw error;
    }
}


// ==========================================
// 2. DỰ ĐOÁN HÌNH ẢNH
// ==========================================

async function predictWaste(imageElement) {

    if (!wasteModel) {
        throw new Error("Mô hình AI chưa sẵn sàng.");
    }

    if (!imageElement) {
        throw new Error("Không có hình ảnh đầu vào.");
    }

    const predictions = await wasteModel.predict(imageElement);

    // Sắp xếp xác suất từ cao xuống thấp
    predictions.sort((a, b) => {
        return b.probability - a.probability;
    });

    return predictions;
}

console.log("Green Vision AI: ai.js đã sẵn sàng.");