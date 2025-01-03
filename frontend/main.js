const API_URL = '/api/items';

function loadItems() {
    $.get(API_URL, (data) => {
        const itemsList = $('#itemsList');
        itemsList.empty();
        data.forEach(item => {
            itemsList.append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${item.text}
                    <div>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${item.id}">編輯</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">刪除</button>
                    </div>
                </li>
            `);
        });
    });
}

function addItem() {
    const itemText = $('#itemInput').val();
    if (!itemText) return;
    $.ajax({
        url: API_URL, // API 地址
        method: 'POST', // 使用 POST 方法
        contentType: 'application/json', // 明確指定 JSON 格式
        data: JSON.stringify({ text: itemText }), // 傳遞數據
        success: () => {
            $('#itemInput').val(''); // 清空輸入框
            loadItems(); // 重新加載項目
        },
        error: (err) => {
            console.error("Error adding item:", err);
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url: `${API_URL}/${id}`,
        type: 'DELETE',
        success: () => loadItems(),
    });
}

function editItem(id) {
    const newText = prompt('輸入新文字:');
    if (!newText) return;
    $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ text: newText }),
        success: () => loadItems(),
    });
}

$(document).ready(() => {
    loadItems();

    $('#addItemBtn').click(addItem);

    $('#itemsList').on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        deleteItem(id);
    });

    $('#itemsList').on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        editItem(id);
    });
});
