---
title: Installing Dokploy on Oracle Cloud
description: A walkthrough for setting up Dokploy on a free VPS
date: 2026-05-30
lastEdited: 2026-05-30
duration: 1 min read
category: Cloud
tags:
  - dokploy
  - oracle cloud
---

If you are anything like me, you want to break into cloud computing — but where do you start? Luckily, I'm here to provide some hopefully useful guidance.

# How It Starts

You will need a `VPS (Virtual Private Server)`. There are many great options out there: [Hostinger](https://www.hostinger.com/vps-hosting), [Vultr](https://www.digitalocean.com/), [Akamai (formerly Linode)](https://www.akamai.com/), [DigitalOcean](https://www.digitalocean.com/), and more. The catch? They all cost money.

Enter [Oracle Cloud Free Tier](https://www.oracle.com/cloud/) — a solid free option to get started.

::note
The specs below reflect what you actually get in practice. AI-generated summaries often report higher figures, but this is what I've experienced firsthand.
::

| Name         | Description      |
| ------------ | ---------------- |
| RAM          | 6 GB             |
| Storage      | 44 GB            |
| Architecture | Ampere (ARM64)   |
| OS           | Linux-based      |
| CPU          | 1 core           |

## Creating an Oracle Account

Head to [oracle.com/cloud](https://www.oracle.com/cloud/) and follow the sign-up steps. **Note:** You will be asked to enter your banking information even for the free tier — this is expected and you won't be charged as long as you stay within free-tier limits. A few important tips:

1. **Remember your cloud name.** This is easy to overlook and difficult to recover if forgotten.
2. When creating a VPS, change the instance shape to the free-tier **Ampere (ARM64)** option — there are three shapes to choose from.
3. Consider switching the instance image from **Oracle Linux** to **Ubuntu** or another Linux distro you're comfortable with.
4. **Enable a public IP address** — don't skip this.
5. [Generate an SSH key](#how-to-generate-ssh-keys-for-oracle-cloud) on your local machine and paste the public key into the instance during setup. This will save you a lot of trouble when connecting later.

## How to Generate SSH Keys for Oracle Cloud

Oracle Cloud only supports RSA-based SSH keys. Open your terminal and run the following command, replacing `{your-email}` with your email or a label of your choice, and `{filename}` with the absolute path where you want the key stored (e.g. `~/.ssh/id_rsa_oracle`).

### Generate an RSA SSH Key

```sh
ssh-keygen -t rsa -b 4096 -C {your-email} -f {filename}
```

### Print Your Public Key

Run this to print the contents of your public key — you'll paste this into Oracle Cloud during instance setup.

```sh
cat ~/.ssh/{filename}.pub
```

## Connecting to Your VPS

SSH into your instance using the `-i` flag to specify your identity file. When prompted about the host fingerprint, enter `yes`.

```sh
ssh -i ~/.ssh/{your-key-file} ubuntu@{ip-address}
```

To avoid typing this every time, add an entry to your SSH config:

```sh
mkdir -p ~/.ssh
touch ~/.ssh/config
nano ~/.ssh/config
```

Add the following block, replacing the placeholders with your values:

```txt
Host {short-name}
    HostName {ip-address}
    User ubuntu
    IdentityFile ~/.ssh/{ssh-filename}
```

## When Do I Install Dokploy?

Almost there — a few more steps first. Before installing anything, it's good practice to harden your instance against common attack vectors.

### Hardening Your VPS

- Update and upgrade all packages
- Set up **UFW** (Uncomplicated Firewall)
- Set up **fail2ban** to block repeated failed login attempts

### Install Dokploy

Now for the main event. Grab the install command from the [Dokploy website](), SSH into your VPS, switch to the root user, and run the script:

```sh
sudo su -
```