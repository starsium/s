<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <title>Starsium Roulette</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: white;
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    h1 {
      color: gold;
    }
    #wheel {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      border: 10px solid gold;
      margin: 2rem;
      background: conic-gradient(
        #444 0% 30%,
        #28a745 30% 65%,
        #17a2b8 65% 90%,
        #ffc107 90% 100%
      );
      transition: transform 4s cubic-bezier(0.33, 1, 0.68, 1);
    }
    .btn {
      background: #1e1e2f;
      color: white;
      border: 2px solid gold;
      padding: 1rem;
      border-radius: 1rem;
      margin: 1rem;
      font-size: 1.1rem;
      cursor: pointer;
    }
    .btn:hover {
      background: gold;
      color: black;
    }
    #result {
      font-size: 1.5rem;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <h1>🎰 Рулетка Starsium</h1>

  <div id="wheel"></div>

  <button class="btn" id="spinBtn">Крутити (1 білет)</button>
  <button class="btn" id="buyBtn">Купити білет (30 грн)</button>
  <input id="promo" placeholder="Введіть промокод" />
  <button class="btn" id="promoBtn">Активувати промокод</button>

  <p id="result"></p>
  <p id="tickets">Ваші білети: 0</p>

  <script>
    let tickets = 0;
    const telegramBotToken = 'ТВОЙ_ТОКЕН_БОТА';
    const telegramChatId = 'ID_ГРУПИ';
    const promoCodes = {
      'FREE15': 1,
      'STARS25': 2,
      'MEGABONUS': 5
    };

    const wheel = document.getElementById('wheel');
    const result = document.getElementById('result');
    const ticketDisplay = document.getElementById('tickets');

    const updateTickets = () => {
      ticketDisplay.textContent = `Ваші білети: ${tickets}`;
    };

    const sendToTelegram = (message) => {
      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message
        })
      });
    };

    document.getElementById('buyBtn').addEventListener('click', () => {
      tickets++;
      updateTickets();
      result.textContent = '💸 Очікуйте... Після оплати білет буде активований (тест режим)';
      sendToTelegram("🔔 Хтось натиснув кнопку 'Купити білет (30 грн)'");
    });

    document.getElementById('promoBtn').addEventListener('click', () => {
      const code = document.getElementById('promo').value.trim().toUpperCase();
      if (promoCodes[code]) {
        tickets += promoCodes[code];
        result.textContent = `🎁 Ви активували промокод "${code}" і отримали ${promoCodes[code]} білет(и)!`;
        delete promoCodes[code];
        updateTickets();
      } else {
        result.textContent = "❌ Невірний або використаний промокод.";
      }
    });

    document.getElementById('spinBtn').addEventListener('click', () => {
      if (tickets <= 0) {
        result.textContent = "😢 У вас немає білетів.";
        return;
      }
      tickets--;
      updateTickets();
      const rotation = 3600 + Math.floor(Math.random() * 360);
      wheel.style.transform = `rotate(${rotation}deg)`;

      setTimeout(() => {
        const chance = Math.random() * 100;
        let prize = '';
        if (chance < 35) prize = '15 зірок';
        else if (chance < 60) prize = '25 зірок';
        else if (chance < 70) prize = '50 зірок';
        else prize = 'нічого';

        result.textContent = prize === 'нічого'
          ? "🙁 Ви нічого не виграли..."
          : `🎉 Ви виграли ${prize}!`;

        sendToTelegram(`🎰 Користувач покрутив рулетку та виграв: ${prize}`);
      }, 4000);
    });
  </script>
</body>
</html>
