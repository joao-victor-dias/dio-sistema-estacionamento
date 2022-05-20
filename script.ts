interface IVeiculo{
    modelo: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const element = (query: string): HTMLInputElement | null => 
        document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio(){
        function ler():IVeiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculos: IVeiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: IVeiculo, salva?: Boolean){
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.modelo}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button> 
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            })
    
            element("#patio")?.appendChild(row); 
            
            if (salva) salvar([...ler(), veiculo]);
        }
    
        function remover(placa: string){
            const {entrada, modelo} = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if (
                !confirm(`O veículo ${modelo} permaneceu por ${tempo}. Deseja encerrar?`)
            )
                return;
            
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        
        function render(){
            element ("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach(veiculo => adicionar(veiculo));
            }
        }
    
        return {ler, adicionar, remover, salvar, render}
    }

    patio().render();

    element('#cadastro')?.addEventListener("click", () => {
        const modelo = element("#modelo")?.value;
        const placa = element("#placa")?.value;

        if(!modelo || !placa){
            alert("Os campos modelo e placa são obrigatórios");
            return;
        }

        console.log(modelo,placa)

       patio().adicionar({modelo, placa, entrada: new Date().toISOString() }, true); 
    });
})();