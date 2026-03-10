## roadmap

- Network edge
- Network core
- Performance
- Protocol layers
- Security‘

# The internet : a "nuts and bolts" view
## what is internet

- Billions of connected computing 
	- **hosts = end system** : all of devices that are being hooked up to the 
	- End systems are connected together by a network of communication links and packet switches.
- Packet switches
- Communication links
	- wired
	- wireless
- Networks
	- a collection of devices
## internet
- network of networks
- interconnected ISPs (internet service provider)
## protocols
- control sending, receiving of messages
>[!note]
>Protocols define the **format**, **order** of message sent and receive among network entities, and **actions** taken on message transmission, receipt
>
## internet standards
- RFC: Request for Comments
- IETF:Internet Engineering Task Force
![[截屏2026-03-03 14.24.45.png]]

# A closer look at Internet Structure

## Network edge:

- hosts: clients and servers
- servers often in data centers

## Access networks, physical media:

- wired, wireless communication links

## Network core:

- interconnected routers
- network of networks
# Access networks and physical media

## classification

- residential access nets
- institutional access networks
- mobile access networks

## evaluation

- bandwidth
- shared or dedicated

## way to access the internet

- **Dial-up Modern**
	![[截屏2026-03-03 14.43.21.png]]
	- uses existing telephony infrastructure
	- can not surf and phone at same time
	- dedicated 
- **digital subscriber line (DSL)**
	![[截屏2026-03-03 14.43.52.png]]
	- use existing telephony line to central office DSLAM
	- data over DSL phone line goes to internet
	- voice over DSL phone line goes to telephone net
	- support surf and phone at the same time
	- dedicated - 负频分用
- **cable-based access**
	![[截屏2026-03-05 08.12.11.png]]
	- HFC : hybrid fiber coax
	- homes share access network to cable headend
- FTTH
	- OLT:把光信号转化为电信号
	- two optical technologies:
		- Passive Optical network(PON):**shared** 
		- Active Optical Network(AON) :selectively transform the data to the host **dedicated**
- home networks
	![[截屏2026-03-05 08.16.54.png]]
- Wireless access networks
	- 802.11b/g/n (WiFi): 
		- 802.11:
		- b/g/n:关系网速和频点
	- Wide-area cellular access networks
- data center networks
	- high-bandwidth links 
	- high speed and easy to expand
## Host:sends packets of data 
![[截屏2026-03-05 08.29.08.png]]
- bandwidth : transmission rate R
## Links: physical media

- bit: smallest unit of data to be transmitted
- physical link: 
	- guided media **copper, fiber, coax**
	- unguided media **ratio**
- Twisted Pair (TP) : twisted the wire to resist the disturbance
	- ![[截屏2026-03-05 08.34.14.png]]
- Coaxial cable: 铜轴电缆
	- ![[截屏2026-03-05 08.36.54.png]]
- Fiber optic cable
	- glass fiber carrying light pulses 
	- high speed  (10-100 Gbs)
	- low error rate 
	- ![[截屏2026-03-05 08.38.47.png]]
- Wireless radio
	- half-duplex :  单向发送,始终只能一个人发不能同时发送
	- no physical wire 
	- propagation environment effects:
		- reflection
		- obstruction by objects
		- interference/noise
## network core

 **definition**
- mesh of interconnected routers
**Tow key network-core functions**
- Forwarding 
- Routingever e ce r ce c k