interface IVehicle{
    model: string;
    plate: string;
    entrace: Date | string;
}

(function () {
    const element = (query: string): HTMLInputElement | null => 
        document.querySelector(query);

    function calcTime(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function yard(){
        function read():IVehicle[]{
            return localStorage.yard ? JSON.parse(localStorage.yard) : [];
        }

        function insert(vehicles: IVehicle[]){
            localStorage.setItem("yard", JSON.stringify(vehicles));
        }

        function add(vehicle: IVehicle, save?: Boolean){
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.model}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.entrace}</td>
                <td>
                    <button class="remove" data-plate="${vehicle.plate}">X</button> 
                </td>
            `;

            row.querySelector(".remove")?.addEventListener("click", function(){
                remove(this.dataset.plate);
            })
    
            element("#yard")?.appendChild(row); 
            
            if (save) insert([...read(), vehicle]);
        }
    
        function remove(plate: string){
            const {entrace, model} = read().find(vehicle => vehicle.plate === plate);
            const time = calcTime(new Date().getTime() - new Date(entrace).getTime());

            if (
                !confirm(`O veículo ${model} permaneceu por ${time}. Deseja encerrar?`)
            )
                return;
            
            insert(read().filter((vehicle) => vehicle.plate !== plate));
            render();
        }
        
        function render(){
            element ("#yard")!.innerHTML = "";
            const yard = read();

            if(yard.length){
                yard.forEach(vehicle => add(vehicle));
            }
        }
    
        return {read, add, remove, insert, render}
    }

    yard().render();

    element('#register')?.addEventListener("click", () => {
        const model = element("#model")?.value.toUpperCase();
        const plate = element("#plate")?.value.toUpperCase();

        if(!model || !plate){
            alert("Os campos modelo e placa são obrigatórios");
            return;
        }

        console.log(model,plate)

       yard().add({model, plate, entrace: new Date().toISOString().toUpperCase() }, true); 
    });
})();