const formDeposit = document.getElementById("depositForm")
const transactionSection = document.getElementById("transactionSection")
const transactionForm = document.getElementById("transactionForm")
const ul = document.querySelector('ul')

//RENDERIZAR TRANSAÇÕES
async function renderTransfers(transfer, reason){
    const valueThatWillAppearOnScreen = transfer.valueTransfered
    const id = transfer.id
    const li = document.createElement("li")
    const span = document.createElement("span")
    const hr = document.createElement("hr")
    span.innerText = `Transfêrencia realizada com sucesso!\n Valor: -$${valueThatWillAppearOnScreen}\n Motivo: ${reason}\n ID: ${id}`
    li.appendChild(span)
    ul.append(li, hr)
}
//PEGAR TRANSFERENCIAS DA DATABASE
async function transactionDataBase() {
    try {
        const response = await fetch("http://localhost:3000/transactions")
        if (!response.ok) throw new Error("Erro ao buscar transações na database")
        const transactions = await response.json()
        transactions.forEach(renderTransfers)
    } catch (error) {
        console.log(error.message)
        console.clear()
    }
    
  }

//RENDERIZAR NOVOS DEPÓSITOS
async function renderDepositTransaction(deposit){
    const valueAdded = deposit.valueAdded
    const id = deposit.id
    const li = document.createElement("li")
    const span = document.createElement("span")
    const hr = document.createElement("hr")
    span.innerText = `Novo depósito\n valor: R$${valueAdded}\n ID: ${id}`
    li.appendChild(span)
    ul.append(li, hr)
}


//PEGAR DEPÓSITOS DA DATA BASE
async function depositTransactions() {
    try {
        const response = await fetch("http://localhost:3000/deposits")
        if(!response.ok) throw new Error("Erro ao buscar depósitos!")
        const deposits = response.json()
        deposits.forEach(renderDepositTransaction)
    } catch (error) {
        console.log(error.message)
        console.clear()
    }
  }



//PEGANDO O SALDO ATUAL DA DATA BASE
async function gettingBalance(){
    try {
        const response = await fetch(("http://localhost:3000/balance"))
        if (!response.ok) throw new Error("Erro ao tentar acessar o saldo na database!")
        const balanceGot = await response.json()
        const balanceSpan = document.getElementById("balance")
        balanceSpan.innerText = balanceGot[0].value
    } catch (error) {
        alert(error.message)
    }
    
}

//Depositando valor na conta
formDeposit.addEventListener('submit', async (evnt) => {
    evnt.preventDefault()
    const currentBalance = parseFloat(document.getElementById("balance").innerText)
    const valueToBeAdd = parseFloat(document.getElementById("deposit").value)
    if (isNaN(valueToBeAdd) || valueToBeAdd <= 0) {
        return alert('Digite um valor para ser depositado!');
    }
    const allBalance = {
        value: currentBalance + valueToBeAdd
    }
    const valueToBeDeposited = {
        valueAdded:valueToBeAdd
    }
    try {
        const responsePut = await fetch("http://localhost:3000/balance/1", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allBalance)
        })
        if(!responsePut.ok) throw new Error("Erro ao tentar realizar o depósito!")
    
        const responsePost = await fetch("http://localhost:3000/deposits", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(valueToBeDeposited)
        })
        if(!responsePost.ok) throw new Error("Erro ao enviar sua transação!")
        const savedDeposit = await responsePost.json()
        renderDepositTransaction(savedDeposit)
        formDeposit.reset()
        gettingBalance()
    } catch (error) {
        console.log(error.message)
    }
})


//TRANSFERÊNCIAS
transactionForm.addEventListener('submit', async (evnt) => {
    evnt.preventDefault()
    const reason = document.getElementById("reason").value
    const valueTransfer = parseFloat(document.getElementById("valueTransaction").value)
    if(!reason || isNaN(valueTransfer) || valueTransfer <= 0|| !isNaN(reason)){
        transactionForm.reset()
        return alert("ERRO!")
    }

    //modificar o saldo atual
    const currentBalance = parseFloat(document.getElementById("balance").innerText)
    const newValue = {
       value: currentBalance - valueTransfer
    } 
    const valueThatWillBeTransfered = {
        valueTransfered: valueTransfer,
        reason: reason
    }
    try {
        const changeBalance = await fetch("http://localhost:3000/balance/1",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newValue)
        })
        if(!changeBalance.ok) throw new Error("Erro ao tentar acessar o seu saldo!")

        const postingTransaction = await fetch("http://localhost:3000/transactions", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(valueThatWillBeTransfered)
        })
        if(!postingTransaction.ok) throw new Error("Erro ao tentar enviar a transaçaõ!")
        const transfer =  await postingTransaction.json()
        renderTransfer = renderTransfers(transfer, reason) 
        transactionForm.reset()
        gettingBalance()
    } catch (error) {
        alert(error.message)
    }
})


    gettingBalance()
    depositTransactions()
    transactionDataBase()

