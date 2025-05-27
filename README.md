# Platformă de donații descentralizată
Această platformă permite oricui să doneze direct și transparent către cauze umanitare sau proiecte sociale, folosind criptomonede. Fiecare campanie de donație este reprezentată de un smart contract care urmărește toate contribuțiile. Fondurile pot fi transferate automat beneficiarului la îndeplinirea unor condiții prestabilite (ex. atingerea unui prag minim).

## Tehnologii:
- Blockchain platform: Ethereum
- Smart contracts: Solidity
- Frontend: React + web3.js
- Framework: Hardhat
- Portofel digital: MetaMask
- Stocare pentru imagini/documente: IPFS

## Autori:
- Coza Cătălin
- Andreica Dragoș
- Sinn Erich
- Șovago Rareș

## Cerințe:
- Node.js
- MetaMask instalat în browser

## Instalare și rulare locală:

### 1. Clonare repo
```bash
git clone https://github.com/catalincoza/Platforma-Donatii-Cripto.git
cd Platforma-Donatii-Cripto
```

### 2. Rulare HardHat node
```
npx hardhat node
```
- Se vor afișa 20 de conturi publice cu ETH pentru testare.
- ⚠️ Nu închide acest terminal! Restul pașilor pot fi urmați în terminale separate.

### 3. Rulare script deploy
```
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Adăugare network & cont în MetaMask

| Câmp                | Valoare                 |
| ------------------- | ----------------------- |
| **Network Name**    | `Hardhat Local`         |
| **RPC URL**         | `http://127.0.0.1:8545` |
| **Chain ID**        | `31337`                 |
| **Currency Symbol** | `ETH`                   |
| **Block Explorer**  | *(gol)*       |

Contul (sau conturile) se adaugă din 'Account' -> '+ Add account or hardware wallet' -> 'Private Key' -> Introdu cheia privată din conturile afișate după rularea node-ului Hardhat (vezi pas 1). Fiecare cont va avea 10.000 ETH pentru testare.

### 5. Pornire aplicație React
```
cd frontend
npm start
```
