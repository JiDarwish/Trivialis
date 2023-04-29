## AWS Lightsail deployment instructions

### Connecting to the server
```bash
ssh -i ../../aws-meedle/aws-meedle.pem ubuntu@2a05:d014:ad4:a400:db3e:1a84:b040:e829
```

### Installing Docker
```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```
Docker compose
```bash
sudo apt-get install -y python3-pip
sudo pip3 install docker-compose
```
Set user group
```bash
sudo gpasswd -a $USER docker
newgrp docker
```

Installing Git
```bash
sudo apt-get install -y git
```

Generate GitHub Project SSH key
```bash
ssh-keygen -t ed25519 -C "dragarfrenk@gmail.com"
cat ~/.ssh/id_ed25519.pub
```
Add the key to GitHub under Deploy keys

### Cloning the repository
```bash
git clone git@github.com:meedle-travel/meedle-app.git
```

### Open ports
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 9000/tcp
```

### Copy .env file
```bash
cp .env.example .env
```
Also change the params in the .env file

### Running the application
```bash
cd meedle-app
sudo docker-compose up -d
```