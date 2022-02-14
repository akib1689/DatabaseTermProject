const search_box = document.getElementById('search-box');

const list = document.getElementById('search-option');

const add_btn = document.getElementById('add-route-btn');

let route_loc = [];
let loc_data = [];

search_box.addEventListener('input', () => {
    let count = search_box.value.length;
    // console.log(count)
    if (count > 3 && count < 15) {
        const xhr = new XMLHttpRequest();
        let url = '/public/location?search=' + search_box.value;
        xhr.open('GET', url, true);
        xhr.onload = function () {
            let obj = JSON.parse(this.responseText);
            let str = '';
            let location;
            let key;
            [loc_data] = [obj.data]
            for (key in obj.data) {
                location = obj.data[key];
                str += `<option class="location" value="${location.NAME}">`
            }
            list.innerHTML = str;
        }
        xhr.send();
    }
})

add_btn.addEventListener('click', () => {
    let str = search_box.value;
    const available = document.getElementsByClassName('location')

    let matched = null;
    for (let i = 0; i < loc_data.length; i++) {
        let loc = loc_data[i].NAME;
        if (str === loc) {
            matched = loc_data[i];
            break;
        }

    }

    // console.log(loc_data)
    if (matched) {
        const table = document.getElementById('table');
        console.log('matched');
        // check if the location is already added to the route
        let added = false;
        for (let i = 0; i < route_loc.length; i++) {
            if (route_loc[i].NAME === str){
                added = true;
                break;
            }
        }
        if (added){
            let partial = document.getElementById('partial')
            partial.innerHTML =
                ` <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Warning!</strong> Location already added to the route.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        }else {
            route_loc.push(matched)
            let tableHtml = ''
            for (let i = 0; i < route_loc.length; i++) {
                tableHtml += '<tr>'
                tableHtml += '<td>' + route_loc[i].NAME + '</td>'
                for (let j = 0; j < route_loc.length; j++) {
                    if (i>j){
                        tableHtml += '<td contenteditable="true">10</td>'
                    }else {
                        tableHtml += '<td contenteditable="false">N/A</td>'
                    }
                }
                tableHtml += '</tr>'
            }
            table.innerHTML = tableHtml;
        }
    } else {
        let partial = document.getElementById('partial')
        partial.innerHTML =
            ` <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Warning!</strong> The Location is not valid.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }

})