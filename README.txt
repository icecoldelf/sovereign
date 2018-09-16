#Follow below steps to set up puppet on ubuntu 16.04

wget https://apt.puppetlabs.com/puppet5-release-xenial.deb
sudo dpkg -i puppet5-release-xenial.deb
sudo apt-get update
sudo apt-get install puppet

-----------------------------
#Clone application from git repository.

git clone https://github.com/icecoldelf/sovereign

-----------------------------
#Change directory to sovereign application folder and apply puppet manifest

sudo puppet apply sovereign.puppet