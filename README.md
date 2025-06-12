# 🌍 Platforma-Donatii-Cripto

O aplicație descentralizată (dApp) pentru susținerea campaniilor caritabile pe blockchain. Utilizatorii pot propune campanii, iar adminul le poate aproba sau respinge. Donațiile se fac în ETH, direct pe contractul campaniei.

---

## 🛠️ Instalare

### 1. Clonare proiect

```bash
git clone https://github.com/catalincoza/Platforma-Donatii-Cripto.git
cd Platforma-Donatii-Cripto
```

### 2. Instalare dependențe (o singură dată)

#### Backend (Hardhat)

```bash
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

#### MetaMask
| Câmp                | Valoare                 |
| ------------------- | ----------------------- |
| **Network Name**    | `Hardhat Local`         |
| **RPC URL**         | `http://127.0.0.1:8545` |
| **Chain ID**        | `31337`                 |
| **Currency Symbol** | `ETH`                   |
| **Block Explorer**  | *(gol)*       |

## ⚙️ Rulare aplicație locală

### 1. Pornește rețeaua locală Hardhat

```bash
npx hardhat node
```

> Va rula o rețea blockchain pe `localhost:8545`.

### 2. Deployează contractul Factory

```bash
npx hardhat run scripts/deployFactory.js --network localhost
```

> Scriptul:
> - Compilează contractele
> - Deployează `DonationCampaignFactory`
> - Salvează ABI + adresă în `frontend/src/contracts/factory-address.json`

### 3. Rulează aplicația React

```bash
cd frontend
npm start
```

> Aplicația va fi disponibilă la `http://localhost:3000`

---

## ✍️ Crearea unei campanii (manual)

1. Accesează aplicația
2. Apasă pe **„Propune o campanie”**
3. Completează:
   - Titlu
   - Descriere
   - Țintă (ETH)
4. Trimite propunerea
5. Adminul (user: admin, parolă: admin123) o poate aproba din pagina **Admin Dashboard**

---

## ⚡ Crearea unei campanii (automat, cu script)

Scriptul `deployCampaign.js` propune și aprobă automat o campanie:

```bash
npx hardhat run scripts/deployCampaign.js --network localhost
```

> Rezultat: o campanie complet funcțională creată pe blockchain.

---

## 🧪 Funcționalități

- ✅ Propunere campanii de utilizatori
- ✅ Aprobare / respingere de către admin
- ✅ Donare ETH cu nume + email
- ✅ Vizualizare progres și listă donatori
- ✅ Retragerea fondurilor la finalizare
- ✅ Interfață MUI modernă

---

## 🧠 Stack Tehnologic

| Tehnologie       | Rol                         |
|------------------|------------------------------|
| Solidity         | Smart contracts              |
| Hardhat          | Framework dezvoltare         |
| ethers.js        | Interacțiune blockchain      |
| React.js         | Frontend interactiv          |
| Material UI      | Interfață modernă            |
| MetaMask         | Portofel tranzacții          |

---

## 👤 Echipa

- Coza Cătălin  
- Andreica Dragoș  
- Sinn Erich  
- Șovago Rareș  

---