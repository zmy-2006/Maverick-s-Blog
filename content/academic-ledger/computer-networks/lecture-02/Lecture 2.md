
# Performance : loss, delay, throughput

>[!abstract]
>![[截屏2026-03-10 13.44.52.png]]
>

## 1.1 Packet queueing delay

-  a : average packet arrival rate
- L : packet length
- R : link bandwidth
$$\frac{L\cdot a}{R} : \frac{arrival\space rate\space of \space bits}{service \space rate\space  of\space  bits}$$
![[截屏2026-03-10 13.52.56.png|636]]
## 1.2 Throughput

>[!abstract] 
>- rate at which bits are being sent from sender to receiver
>- per-connection end - end throughput : $\min (R_c,R_s.R/10)$

![[截屏2026-03-10 13.56.56.png]]
## 1.3 Goodput

>[!abstract]
>- useful put per seconds

# Protocol layers  and service models

## 2.1 reason for layering

- explicit structure allows identification, relationship of system's pieces
- modularization eases maintenance, updating of system
## 2.2 Layered Internet protocol stack

- **application**
	- supporting network applications
- **transport**
	- process-process data transfer
- **network**
	- routing of datagrams from source to destination
- **link**
	- data transfer between neighboring
- **physical**