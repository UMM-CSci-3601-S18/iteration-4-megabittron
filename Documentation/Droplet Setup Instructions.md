#### Droplet Setup Instructions

## Summary
This document is, essentially, a short guide to setting up a "droplet" on [DigitalOcean](https://www.digitalocean.com)
to be used as a tool for deploying simple web applications. This is by no means a
comprehensive guide, and you are encouraged to reach out to classmates, faculty, and
TAs (through Slack, for example) with questions.

The majority of the information here will be presented in the form of bulleted lists,
because we all know none of us actually read walls of text.

These instructions assume you're in the lab. The SSH key part in particular won't likely work if you're not.
If you don't get the SSH keypair stuff right, you'll probably have a pile of issues logging in
to your droplet.

Most of this will happen in a terminal window, which is yet another reason to take
some time to learn how to use the Unix shell.

### Some terminology:
You're going to see the word "droplet" used a lot here. Digital ocean is in the
business of hosting Virtual Private Servers (VPS), which they have decided to call
"droplets." The term isn't terribly important, and for the most part just refers
specifically to the VPSs hosted by DigitalOcean and all the features which that
entails.

## Step 1: Creating an account
- Go to [Digital Ocean](https://www.digitalocean.com).
- You *can* create an account without adding billing information.
- You *cannot* create any droplets without "activating" your account (by adding billing info).
- You *do* get $50 of free credit for D.O. through [the Github StudentPack](https://education.github.com/pack). Be sure to redeem it.

## Step 2: Generating an SSH keypair
- Follow these directions: [How to Configure SSH Key-Based Authentication on a Linux Server](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)
   - All this happens in a terminal window.
   - Steps 1 and 2 happen on the machine in the lab.
   - Steps 3 and 4 will happen on the Digital Ocean VPS when you have one set up.

## Step 3: Creating a droplet
- Click the big shiny "Create" button, and choose "Droplet" as the thing you want to create.
- Select the suggested Ubuntu version as your operating system.
- Select the smallest droplet, it should be $5 / month.
- Don't add block storage.
- Stick with the default datacenter / region (probably New York).
- Don't select any additional options.
- Add an SSH key. Use the contents of the public key file you generated in step 2.
   - DigitalOcean will use this info to automagically do steps 3 and 4 from the SSH keypair instructions so you never have to do them "by hand".
- Finally, only make one droplet and choose a name for it.
- It will take a couple seconds to make the droplet.


## Step 4: Setting up your droplet
- SSH to your droplet by running ``ssh root@[my ip here]`` (using the IP of your droplet)
- Logged in? Good, keep reading. Problems? Ask someone for help (or Google).
- run: ``wget https://gist.githubusercontent.com/pluck011/f44c9d1557a5127e100a300d018d3b63/raw/f78291783666ca776681ff9e1fd9e99428d6c522/3601-setup.sh`` as root.
- run ``chmod +x 3601-setup.sh``
- run ``./3601-setup.sh``
- Do whatever it asks.
- Reboot the droplet by typing `reboot`. SSH into `deploy-user@[my ip here]`.

## Step 5: Running your project
- Use ``git clone [your repo url here]`` to get your repo on the droplet.
- Use ``cd [your repo name]`` to move into the directory you just grabbed from github. (cd = Change Directory)
- Use ``cd client/src/envrionments/`` and type `nano envrionment.prod.ts`.
- Edit the API_URL to reflect the IP address of your droplet with `:4567/api/` at the end of it. (i.e. `http://192.168.0.1:4567/api/`). Use `Ctrl + X` to exit and then save the file. NOTE: If you use HTTPS for your project, make sure to change `http` to `https` in the URL.
- Navigate back to your repository. (Type `cd ~` and then `cd [your repo name]`).
- Run `./build.sh` to build and deploy your project.
- run ``tmux`` to enter a Tmux session.
- run ``./3601.sh`` to start your server (**3601.sh** is in the home directory `cd ~`).
- press ``Ctrl + b`` and then ``d`` to *detach* from this Tmux session. It will continue running even after you log out. To reconnect to the Tmux session, log into your droplet and run ``tmux a`` (a for *attach*!)

If you're interested in doing more fun things with Tmux, check out [this](https://gist.github.com/MohamedAlaa/2961058) cheat-sheet. Tmux is a really cool tool, and if you ever plan on doing system administration stuff in the future it's worth getting to know it.

#### Updating your project
- Navigate to the home directory.
- Run ``rm -rf server/`` to remove the old version.
- Navigate to the repository directory on your droplet.
- Run ``git pull``
- Repeat steps starting at ``./build.sh`` from above.

## Logging in from outside the lab, or as someone other than the person who did this setup.
- You're free to add accounts to your droplet as you see fit and provide that login info to others.
- You **should not** share the private key that you generated.
- You can enable password ssh logins by editing the ``PasswordAuthentication`` field in ``/etc/ssh/sshd_config``
