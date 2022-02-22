const source = document.getElementById('source')
const destination = document.getElementById('destination')
const route_box =document.getElementById('route')
const loc_list = document.getElementById('loc-option')
const route_list = document.getElementById('route-option')
const bus_list = document.getElementById('bus-option')
let loc_data = [];


function check() {
    let src = source.value;
    let des = destination.value;
    if (!src|| !des){
        return false;
    }
    return !(isNaN(src) || isNaN(des));
}

async function handler(){
    let count = this.value.length;
    // console.log(count)
    if (count > 3 && count < 15) {
        const xhr = new XMLHttpRequest();
        let url = '/public/location?search=' + this.value;
        xhr.open('GET', url, true);
        xhr.onload = function () {
            let obj = JSON.parse(this.responseText);
            let str = '';
            let loc;
            let key;
            [loc_data] = [obj.data]
            for (key in obj.data) {
                loc = obj.data[key];
                str += `<option class="location" value="${loc.ID}">${loc.NAME}</option>`
            }
            loc_list.innerHTML = str;

        }
        xhr.send();
    }

    if (check()){
        console.log('valid for req')
        const xhr = new XMLHttpRequest();
        let url = '/public/fare?src=' + source.value + '&des=' + destination.value;
        xhr.open('GET', url, true);
        xhr.onload = function () {
            let obj = JSON.parse(this.responseText);
            let str = '';
            let row;
            let key;
            [loc_data] = [obj.data]
            for (key in obj.data) {
                row = obj.data[key];
                str += `<option value="${row.R_ID}">, fare = ${row.FARE}</option>`
            }
            route_list.innerHTML = str;

        }
        xhr.send();
    }
}


source.addEventListener('input', handler)
destination.addEventListener('input', handler);
route_box.addEventListener('input', ()=>{
    let route = route_box.value;
    if (isNaN(route)){
        let partial = document.getElementById('partial')
        partial.innerHTML =
            ` <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Warning!</strong> Please Input the ID of the route.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        return;
    }

    const xhr = new XMLHttpRequest();
    let url = '/public/route/' + route +'/bus';
    xhr.open('GET', url, true);
    xhr.onload = function () {
        let obj = JSON.parse(this.responseText);
        let str = '';
        let row;
        let key;
        console.log(loc_data);
        for (key in obj.data) {
            row = obj.data[key];
            str += `<option value="${row.B_ID}"> operation = ${row.OPERATE_DATE}</option>`
        }
        bus_list.innerHTML = str;
    }
    xhr.send();
})