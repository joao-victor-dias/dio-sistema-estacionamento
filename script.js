(function () {
    var _a;
    const element = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function yard() {
        function read() {
            return localStorage.yard ? JSON.parse(localStorage.yard) : [];
        }
        function insert(vehicles) {
            localStorage.setItem("yard", JSON.stringify(vehicles));
        }
        function add(vehicle, save) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.model}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.entrace}</td>
                <td>
                    <button class="remove" data-plate="${vehicle.plate}">X</button> 
                </td>
            `;
            (_a = row.querySelector(".remove")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.plate);
            });
            (_b = element("#yard")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (save)
                insert([...read(), vehicle]);
        }
        function remove(plate) {
            const { entrace, model } = read().find(vehicle => vehicle.plate === plate);
            const time = calcTime(new Date().getTime() - new Date(entrace).getTime());
            if (!confirm(`O veículo ${model} permaneceu por ${time}. Deseja encerrar?`))
                return;
            insert(read().filter((vehicle) => vehicle.plate !== plate));
            render();
        }
        function render() {
            element("#yard").innerHTML = "";
            const yard = read();
            if (yard.length) {
                yard.forEach(vehicle => add(vehicle));
            }
        }
        return { read, add, remove, insert, render };
    }
    yard().render();
    (_a = element('#register')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const model = (_a = element("#model")) === null || _a === void 0 ? void 0 : _a.value.toUpperCase();
        const plate = (_b = element("#plate")) === null || _b === void 0 ? void 0 : _b.value.toUpperCase();
        if (!model || !plate) {
            alert("Os campos modelo e placa são obrigatórios");
            return;
        }
        console.log(model, plate);
        yard().add({ model, plate, entrace: new Date().toISOString().toUpperCase() }, true);
    });
})();
