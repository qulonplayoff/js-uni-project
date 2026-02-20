let devices = [];

// дістаємо дані з пам'яті, щоб не пропадали після f5
let savedData = localStorage.getItem("lr1_data");
if (savedData !== null) {
    devices = JSON.parse(savedData);
}

function saveToStorage() {
    let jsonText = JSON.stringify(devices);
    localStorage.setItem("lr1_data", jsonText);
}

function renderTable() {
    let tbody = document.getElementById("tableBody");
    let htmlContent = "";

    let searchText = document.getElementById("searchInput").value.toLowerCase();
    let filterStatus = document.getElementById("filterSelect").value;

    for (let i = 0; i < devices.length; i++) {
        let item = devices[i];

        let textMatch = false;
        if (item.serial.toLowerCase().includes(searchText) || item.owner.toLowerCase().includes(searchText)) {
            textMatch = true;
        }

        let statusMatch = false;
        if (filterStatus === "Всі" || item.status === filterStatus) {
            statusMatch = true;
        }

        if (textMatch === true && statusMatch === true) {
            htmlContent += "<tr>";
            htmlContent += "<td>" + item.serial + "</td>";
            htmlContent += "<td>" + item.type + "</td>";
            htmlContent += "<td>" + item.owner + "</td>";
            htmlContent += "<td>" + item.status + "</td>";
            htmlContent += "<td>" + item.comment + "</td>";
            htmlContent += "<td>";
            // записуємо id в data-id щоб потім знати яку кнопку натиснули
            htmlContent += "<button type='button' class='edit-btn' data-id='" + item.id + "'>Редагувати</button> ";
            htmlContent += "<button type='button' class='delete-btn' data-id='" + item.id + "'>Видалити</button>";
            htmlContent += "</td>";
            htmlContent += "</tr>";
        }
    }

    tbody.innerHTML = htmlContent;
}

let form = document.getElementById("deviceForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    document.getElementById("serialError").innerHTML = "";
    document.getElementById("ownerError").innerHTML = "";

    let serialVal = document.getElementById("serialInput").value;
    let typeVal = document.getElementById("typeSelect").value;
    let ownerVal = document.getElementById("ownerInput").value;
    let statusVal = document.getElementById("statusSelect").value;
    let commentVal = document.getElementById("commentInput").value;
    let idVal = document.getElementById("deviceId").value;

    let hasError = false;

    if (serialVal === "") {
        document.getElementById("serialError").innerHTML = "Введіть серійний номер!";
        hasError = true;
    }
    if (ownerVal === "") {
        document.getElementById("ownerError").innerHTML = "Вкажіть власника!";
        hasError = true;
    }
    if (typeVal === "" || statusVal === "") {
        alert("Помилка: оберіть тип носія та статус!");
        hasError = true;
    }

    if (hasError === true) {
        return;
    }

    if (idVal === "") {
        let newItem = {
            id: Date.now(), // генерація унікального айдішника
            serial: serialVal,
            type: typeVal,
            owner: ownerVal,
            status: statusVal,
            comment: commentVal
        };
        devices.push(newItem);
    } else {
        for (let i = 0; i < devices.length; i++) {
            if (devices[i].id == idVal) {
                devices[i].serial = serialVal;
                devices[i].type = typeVal;
                devices[i].owner = ownerVal;
                devices[i].status = statusVal;
                devices[i].comment = commentVal;
            }
        }
        document.getElementById("form-title").innerHTML = "Додати пристрій";
    }

    saveToStorage();
    renderTable();
    form.reset();
    document.getElementById("deviceId").value = "";
});

// делегування - вішаємо клік на всю таблицю замість кожної кнопки окремо
document.getElementById("tableBody").addEventListener("click", function(event) {
    let target = event.target;
    let id = target.getAttribute("data-id");

    if (target.className === "delete-btn") {
        let confirmDelete = confirm("Ви точно хочете видалити цей запис?");
        if (confirmDelete === true) {
            let newArray = [];
            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id != id) {
                    newArray.push(devices[i]);
                }
            }
            devices = newArray;

            saveToStorage();
            renderTable();
        }
    }

    if (target.className === "edit-btn") {
        for (let i = 0; i < devices.length; i++) {
            if (devices[i].id == id) {
                document.getElementById("deviceId").value = devices[i].id;
                document.getElementById("serialInput").value = devices[i].serial;
                document.getElementById("typeSelect").value = devices[i].type;
                document.getElementById("ownerInput").value = devices[i].owner;
                document.getElementById("statusSelect").value = devices[i].status;
                document.getElementById("commentInput").value = devices[i].comment;

                document.getElementById("form-title").innerHTML = "Редагувати пристрій";
            }
        }
    }
});

document.getElementById("clearBtn").addEventListener("click", function() {
    form.reset();
    document.getElementById("deviceId").value = "";
    document.getElementById("form-title").innerHTML = "Додати пристрій";
    document.getElementById("serialError").innerHTML = "";
    document.getElementById("ownerError").innerHTML = "";
});

document.getElementById("searchInput").addEventListener("input", function() {
    renderTable();
});
document.getElementById("filterSelect").addEventListener("change", function() {
    renderTable();
});

renderTable();