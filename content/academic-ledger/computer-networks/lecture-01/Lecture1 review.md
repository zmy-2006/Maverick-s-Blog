
# 1.  view of internet
---
## 1.1 nuts and bolts

- hosts and end system
- communication links 
- packet switches
	- routers : network core
	- link-layer switches : access network

>[!note]
>end system access the Internet through Internet Service Providers (ISP)
>ISP is in itself a network of packet switches and communication links
>

- protocols
	- IP : Internet Protocol
	- TCP : Transmission Control Protocol

## 1.2 Internet services view

-  "an infrastructure that provides services to applications."
-  "provides programming interface to distributed applications"

>[!note] protocol
>A protocol defines the format and the order of messages exchanged between two
>or more communicating entities, as well as the actions taken on the transmission
>and/or receipt of a message or other event.

# 2.  Network edge

---
>[!abstract]
>- hosts : clients and servers
>- servers often in data centers

## 2.1 Dial-up Modem

 ![[截屏2026-03-08 16.55.57.png|632]]
 - use telephony infrastructure
 - can not surf and phone at same time
## 2.2 digital subscriber line (DSL)

![[截屏2026-03-08 16.58.13.png|636]]

- short distance only (within 5-10 miles
- asymmetric : download faster than upload

**factors that affect the speed**

- the distance between the home and the CO
- the gauge of the twisted-pair line
- the degree of electrical interference
>[!note]
>CO : central office
>DSLAM : digital  subscriber line access multiplexer

## 2.3 cable - based access

![[截屏2026-03-08 22.51.03.png]]
- homes share access network to cable headend
## 2.4 fiber to the home (FTTH)
![[截屏2026-03-08 22.59.25.png]]
- provide an optical path from the CO directly to the home

## 2.5 Wireless access networks

- WLANs : wireless local area networks
	- short distance
	- 11 , 54 ,450 Mbps transmission rate
- Wide - area cellular access networks
	- long distance
	- 10 Mbps
## 2.6 enterprise network

![[截屏2026-03-08 23.07.16.png]]
- mix of wired, wireless link technologies, connecting a mix of switches and routers
	- Ethernet : wired access at 100Mbps, 1Gbps, 10Gbps (**high speed**)
	- WiFi : wireless access points at 11 , 54 , 450 Mbps (**low speed**)

## 2.7 Physical Media

>[!note]
>physical media fall into two categories: guided media and unguided media
>- guided media : signals propagate in solid media
>- unguided media : signals propagate freely



### Twisted pair (TP)

- two insulated copper wires
- the least expensive and the most prevalent

### Coaxial cable

 - bidirectional
- a number of end systems can be connected directly to the cable

### Fiber Optics

- glass fiber carrying light pulses which represent bits
- high speed operation
- preferred long haul guided transmission media, particularly for overseas links
- high cost
- anti electromagnetic interference

### Wireless radio

- carry signals in electromagnetic spectrum
- no physical wire
- propagation environment effects
	- reflection
	- obstruction 
	- interference / noise


### Radio link types

![[截屏2026-03-08 23.33.09.png]]
# Network Core
---

>[!abstract] packet-switching
>- hosts break application-layer messages into packets
>- network forwards packets from one router to the next, across links on path from source to destination

## 3.1 Packet-Switching
### Store and Forward
![[截屏2026-03-09 08.28.19.png]]
-  the packet switch must receive the entire packet before it can begin to transmit the first bit of the packet onto the outbound link.

- store-and-forward delay(sending one packet from source to des-tination over a path consisting of N links each of rate R):
$$d_{end-to-end}=N\frac{L}{R}$$
### Queuing Delay and Packet Loss
![[截屏2026-03-09 08.38.56.png]]
- queuing delay : depend on the level of congestion in the network
- packet loss : the buffer is completely full when new packet arrive, thus either the new packet or one of the already- queued packets will be dropped
### Forwarding Tables and Routing Protocols

- every end system has an IP address which has a hierarchical structure
- when a packet arrives at a router the router examine the address and forwards the packets to adjacent router
- each router has a forwarding table that maps destination address
## 3.2 circuit switching
![[截屏2026-03-09 09.03.53.png]]
- dedicated resources : no sharing
- circuit segment idle if not used by call
- make reservation to avoid delay
### Frequency division multiplexing (FDM)
![[截屏2026-03-09 09.06.50.png]]
- optical , electromagnetic frequencies divided into frequency bands
- each call allocated its own band, can transmit at max rate of that band

### Time Division Multiplexing (TDM)

![[截屏2026-03-09 09.10.55.png]]
- time divided into slots
- each call allocated periodic slots, can frequency transmit at maximum rate of (wider) frequency band only during its time slots