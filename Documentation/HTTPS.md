#Using HTTPS for your project

##Digital Ocean
This document explains how to configure your DigitalOcean droplet
IP address to work with https, assuming that you are following this
guide to create and maintain your droplet: [UMM CSCI 3601 Droplet Setup Instructions](https://gist.github.com/pluck011/d968c2280cc9dc190a294eaf149b1c6e)

##Domain Name Registration
A domain name is required in order for your website to be secure,
so you can purchase one from a domain registrar such as namecheap,
godaddy, hostgator, etc. We first used namecheap and bought
mypanda.website for $1/year because of our limited budget. If you
have a github student pack, you can buy a domain from namecheap
for free or discounted.

##Cloudflare
[CloudFlare.com](https://www.cloudflare.com/) allows you to add an SSL certificate 
to your website. Create an account and sign in.

####DNS Records
Under your DNS Records, add a record with these settings:

_Type: A <br>
Name: yourdomain.com <br>
Value: your droplet IP address without a port <br>
TTL: Automatic <br>_

Add another record with these settings:

_Type: A <br>
Name: www <br>
Value: your droplet IP address without a port <br>
TTL: Automatic <br>_

####Cloudflare Nameservers
In this section, you are given NS pointers with values that are needed for your
domain's registrar. In mine, I have the two following pointers:

_ali.ns.cloudflare.com <br>
elliot.ns.cloudflare.com_

Have these ready for the following step.

##Pointing your domain name to Cloudflare
We are using namecheap, so this step may be different if you are using
another domain registrar.

Sign in, then go to your Dashboard. Next to your domain name, click the "Manage"
button.

Next to "NAMESERVERS", select "Custom DNS" on the dropdown menu. Copy and paste
the two values that you saved earlier (in our case, it is _ali.ns.cloudflare.com_
and _elliot.ns.cloudflare.com_). It could take up to 24 hours for this to take effect.

##Deploying your droplet
In [these](https://gist.github.com/pluck011/d968c2280cc9dc190a294eaf149b1c6e) instructions,
you will need to put your domain name into your environment.prod.ts file instead of your
DigitalOcean droplet's IP address. To do this, on the line API_URL, enter 
```https://yourdomain.com/api/```.

Then, navigate to your Server.java file and do ```nano Server.java```. Find your server port (in
our case it is 4567). Change ```4567``` to ```80``` then save and complete all of the
remaining steps to deploy your droplet.

