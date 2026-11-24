// ======================================
// GREEN VISION AI - HISTORY & STATISTICS
// ======================================

const HISTORY_KEY = "greenVisionHistory";
const MAX_HISTORY = 100;

// ======================================
// 1. LẤY LỊCH SỬ
// ======================================

function getHistory() {
    try {
        const data = localStorage.getItem(HISTORY_KEY);

        if (!data) return [];

        const history = JSON.parse(data);

        return Array.isArray(history) ? history : [];

    } catch (error) {
        console.error("Lỗi đọc lịch sử:", error);
        return [];
    }
}

// ======================================
// 2. XÁC ĐỊNH NHÓM RÁC
// ======================================

function getWasteClass(item) {

    const className = (item.className || "").trim().toLowerCase();
    const name = (item.name || "").trim().toLowerCase();

    const value = className || name;

    if (value.startsWith("organic") || value.includes("hữu cơ")) {
        return "Organic";
    }

    if (value.startsWith("paper") || value.includes("giấy")) {
        return "Paper";
    }

    if (value.startsWith("plastic") || value.includes("nhựa")) {
        return "Plastic";
    }

    if (value.startsWith("metal") || value.includes("kim loại")) {
        return "Metal";
    }

    if (value.startsWith("other") || value.includes("rác khác")) {
        return "Other";
    }

    return null;
}

// ======================================
// 3. LƯU LỊCH SỬ
// ======================================

function saveHistory(item) {

    try {

        if (!item || !item.name) {
            console.error("Dữ liệu lịch sử không hợp lệ.");
            return false;
        }

        const history = getHistory();

        const newItem = {
            name: item.name,
            time: item.time || new Date().toLocaleString("vi-VN"),
            confidence: Number(item.confidence) || 0,
            className: item.className || "",
            timestamp: Date.now()
        };

        history.unshift(newItem);

        const limitedHistory = history.slice(0, MAX_HISTORY);

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(limitedHistory)
        );

        renderHistory();
        renderStatistics();

        console.log("Đã lưu lịch sử nhận diện.");

        return true;

    } catch (error) {

        console.error("Lỗi lưu lịch sử:", error);
        alert("Không thể lưu lịch sử nhận diện.");

        return false;
    }
}

// ======================================
// 4. HIỂN THỊ LỊCH SỬ
// ======================================

function renderHistory() {

    const history = getHistory();

    const historyList = document.getElementById("historyList");

    if (!historyList) {
        console.warn("Không tìm thấy vùng hiển thị lịch sử.");
        return;
    }

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            '<p class="empty-history">Chưa có dữ liệu nhận diện.</p>';

        return;
    }

    history.forEach((item, index) => {

        const row = document.createElement("div");
        row.className = "history-item";

        const left = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = (index + 1) + ". " + item.name;

        const time = document.createElement("small");
        time.textContent = item.time || "";

        left.appendChild(name);
        left.appendChild(time);

        const right = document.createElement("strong");

        const confidence = Number(item.confidence);

        right.textContent =
            Number.isFinite(confidence) ?
            (confidence * 100).toFixed(1) + "%" :
            "Không rõ";

        row.appendChild(left);
        row.appendChild(right);

        historyList.appendChild(row);
    });
}

// ======================================
// 5. THỐNG KÊ 5 NHÓM RÁC
// ======================================

function renderStatistics() {

    const history = getHistory();

    const total = history.length;

    const totalElement =
        document.getElementById("totalRecognitions");

    if (!totalElement) {
        console.warn("Không tìm thấy vùng thống kê.");
        return;
    }

    totalElement.textContent = total;

    const statistics = {
        Organic: 0,
        Paper: 0,
        Plastic: 0,
        Metal: 0,
        Other: 0
    };

    // Đếm số lượt của từng nhóm
    history.forEach(item => {

        const wasteClass = getWasteClass(item);

        if (wasteClass && statistics[wasteClass] !== undefined) {
            statistics[wasteClass]++;
        }
    });

    // Cập nhật số lượng và thanh biểu đồ
    const groups = [{
            key: "Organic",
            countId: "organicCount",
            barId: "organicBar"
        },
        {
            key: "Paper",
            countId: "paperCount",
            barId: "paperBar"
        },
        {
            key: "Plastic",
            countId: "plasticCount",
            barId: "plasticBar"
        },
        {
            key: "Metal",
            countId: "metalCount",
            barId: "metalBar"
        },
        {
            key: "Other",
            countId: "otherCount",
            barId: "otherBar"
        }
    ];

    groups.forEach(group => {

        const count = statistics[group.key];

        const countElement =
            document.getElementById(group.countId);

        const barElement =
            document.getElementById(group.barId);

        const percentage =
            total > 0 ? (count / total) * 100 : 0;

        if (countElement) {
            countElement.textContent =
                count + " lượt (" + percentage.toFixed(1) + "%)";
        }

        if (barElement) {
            barElement.style.width = percentage + "%";
        }
    });

    console.log("Đã cập nhật thống kê:", statistics);
}

// ======================================
// 6. XÓA LỊCH SỬ
// ======================================

function clearHistory() {

    const confirmed = confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ lịch sử nhận diện?"
    );

    if (!confirmed) return;

    try {

        localStorage.removeItem(HISTORY_KEY);

        renderHistory();
        renderStatistics();

        console.log("Đã xóa lịch sử nhận diện.");

    } catch (error) {

        console.error("Lỗi xóa lịch sử:", error);
        alert("Không thể xóa lịch sử.");
    }
}

// ======================================
// 7. KHỞI TẠO
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const clearButton =
        document.getElementById("clearHistoryBtn");

    if (clearButton) {
        clearButton.addEventListener("click", clearHistory);
    }

    renderHistory();
    renderStatistics();

});

console.log("Green Vision AI: history.js đã sẵn sàng.");

// ======================================