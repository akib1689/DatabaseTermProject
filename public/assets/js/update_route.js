const route_name = document.getElementById('param_name')
const table = document.getElementById('table')
const list = document.getElementById('route-list')
let loc_data = [];
let route_loc = [];
let loc_id = [];
route_name.addEventListener('input', ()=>{
    const xhr = new XMLHttpRequest();
    let id = route_name.value;
    if (isNaN(id)){
        let partial = document.getElementById('partial')
        partial.innerHTML =
            ` <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Warning!</strong> Please Input the id of the route to edit.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }
    let url = '/public/route/' + id + '/fare';
    xhr.open('GET', url, true);
    xhr.onload = function () {
        let obj = JSON.parse(this.responseText);
        [loc_data] = [obj.data];
        let str = '';
        let cnt = 0;
        let max = 0;
        let changed = false;
        while (cnt<loc_data.length){
            let row = loc_data[cnt]
            let current_start_id = row.LOC_1;
            let inner = 0;
            let table_row = '';
            table_row += `<tr><td>${row.LOC_1_NAME}</td>`
            route_loc.push({
                name: row.LOC_1_NAME
            })
            loc_id.push({
                id : row.LOC_1
            });
            while (cnt < loc_data.length && current_start_id === loc_data[cnt].LOC_1){
                table_row += `<td><input type="number" class="table-cell" value="${loc_data[cnt].FARE}" name="fares"></td>`
                cnt++;
                inner++;
            }
            if (!changed){
                max = cnt;
                changed = true;
                console.log(max);
            }

            while (inner < max){
                table_row += `<td>N/A</td>`
                inner++;
            }
            table_row += '</tr>'
            str = table_row + str;
        }
        let head_row = '';
        head_row += `<tr><td></td><td>${loc_data[cnt-1].LOC_2_NAME}</td>`
        loc_id.push({
            id:loc_data[cnt-1].LOC_2
        })
        for (let i = route_loc.length-1; i > 0; i--) {
            head_row += `<td>${route_loc[i].name}</td>`
        }

        let listHTML = '';
        for (let i = loc_id.length-1; i >= 0 ; i--) {
            let curr_loc = loc_id[i];
            listHTML += `<li> <input type="number" name="loc_id" value="${curr_loc.id}"></li>`
        }
        list.innerHTML = listHTML;

        head_row += `</tr>`
        str = head_row + str;
        table.innerHTML = str;
    }
    xhr.send();
})