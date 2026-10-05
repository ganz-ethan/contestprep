// 55 original AIME-style problems here (aime-6 to aime-60; aime-1 to aime-5 are in problems.js). Integer answers 0-999,
// every one recomputed by brute force in verify_aime.js.
function A(id, topic, diff, tags, q, answer, hints, sol, mistakes) {
  PROBLEMS.push({ id, track: "aime", topic, diff, tags, q, answer, hints, sol, mistakes });
}

A("aime-6","cnt",4,["combinations","digits"],
  R`How many four-digit positive integers have digits that are strictly increasing from left to right (like $1389$)?`,126,
  [R`A strictly increasing digit string is determined by the set of digits it uses.`,R`Could the digit $0$ appear? It would have to be the first digit.`,R`Choose $4$ distinct digits from $1,\ldots,9$.`],
  R`A strictly increasing number is determined by its set of four distinct digits, arranged in the only possible increasing order. A $0$ would have to come first, which is not allowed, so choose from $\{1,\ldots,9\}$: $\binom94=\boxed{126}$.`);

A("aime-7","nt",5,["divisor function","casework"],
  R`How many positive integers $n\lt1000$ have exactly $8$ positive divisors?`,180,
  [R`The number of divisors is $\prod(e_i+1)$. Which exponent patterns give $8$?`,R`$8=8=4\cdot2=2\cdot2\cdot2$, so $n=p^7$, $p^3q$, or $pqr$ with distinct primes.`,R`Count each pattern below $1000$ separately. The case $pqr$ is the biggest.`],
  R`The patterns are $p^7$, $p^3q$, and $pqr$. Below $1000$: $p^7$ gives only $2^7=128$ (1 number). $p^3q$ gives $44$ numbers. $pqr$ (three distinct primes) gives $135$ numbers. Total $1+44+135=\boxed{180}$.`,
  R`In the $p^3q$ case, remember $p\ne q$ and that both $p^3q$ with $p=2,q=3$ and $p=3,q=2$ are different numbers.`);

A("aime-8","nt",5,["difference of squares","perfect squares"],
  R`Find the sum of all positive integers $n$ such that $n^2+10n+2024$ is a perfect square.`,994,
  [R`Complete the square: $n^2+10n=(n+5)^2-25$.`,R`So you need $m^2-(n+5)^2=1999$. Is $1999$ prime?`,R`$1999$ is prime, so $(m-n-5)(m+n+5)=1\cdot1999$.`],
  R`Write $n^2+10n+2024=(n+5)^2+1999=m^2$. Then $(m-(n+5))(m+(n+5))=1999$, which is prime. So $m-(n+5)=1$ and $m+(n+5)=1999$, giving $n+5=999$, $n=\boxed{994}$. It is the only solution.`);

A("aime-9","alg",5,["recurrence","modular arithmetic"],
  R`A sequence has $a_1=a_2=1$ and $a_n=a_{n-1}+2a_{n-2}$ for $n\ge3$. What is the remainder when $a_{15}$ is divided by $1000$?`,923,
  [R`Compute the first several terms: $1,1,3,5,11,21,\ldots$ and look for a formula.`,R`Try $a_n=\frac{2^n-(-1)^n}{3}$ and check it satisfies the recurrence.`,R`$a_{15}=\frac{2^{15}+1}{3}$.`],
  R`The characteristic roots are $2$ and $-1$, and the initial conditions give $a_n=\frac{2^n-(-1)^n}{3}$. So $a_{15}=\frac{32768+1}{3}=10923$, and $10923\bmod1000=\boxed{923}$.`);

A("aime-10","cnt",5,["surjections","inclusion-exclusion"],
  R`In how many ways can $6$ different people be assigned to $3$ labeled rooms so that every room has at least one person?`,540,
  [R`Count all assignments first, then subtract the ones that leave a room empty.`,R`Total: $3^6$. At least one room empty: use inclusion-exclusion.`,R`$3^6-3\cdot2^6+3\cdot1^6$.`],
  R`By inclusion-exclusion, the count is $3^6-\binom31 2^6+\binom32 1^6=729-192+3=\boxed{540}$.`,
  R`Do not forget to add back the cases where two rooms are empty.`);

A("aime-11","cnt",4,["probability","binomial"],
  R`A fair coin is flipped $8$ times. The probability of getting exactly $4$ heads is $\frac mn$ in lowest terms. Find $m+n$.`,163,
  [R`Count outcomes with exactly $4$ heads, out of $2^8$.`,R`$\binom84=70$ and $2^8=256$.`,R`Reduce $\frac{70}{256}$, then add numerator and denominator.`],
  R`The probability is $\frac{\binom84}{2^8}=\frac{70}{256}=\frac{35}{128}$. So $m+n=35+128=\boxed{163}$.`);

A("aime-12","nt",4,["inclusion-exclusion","powers"],
  R`How many positive integers less than $1000$ are neither perfect squares nor perfect cubes?`,962,
  [R`Count the squares, the cubes, and the numbers that are both.`,R`A number that is both a square and a cube is a sixth power.`,R`Squares: $31$, cubes: $9$, sixth powers: $3$ (namely $1,64,729$).`],
  R`Among $1,\ldots,999$: perfect squares $1^2,\ldots,31^2$ (31), perfect cubes $1^3,\ldots,9^3$ (9), and sixth powers $1,64,729$ (3). So $999-(31+9-3)=\boxed{962}$.`);

A("aime-13","alg",4,["symmetric sums","power sums"],
  R`Real numbers $x$ and $y$ satisfy $x+y=6$ and $xy=4$. Find $x^4+y^4$.`,752,
  [R`Build up from $x^2+y^2$.`,R`$x^2+y^2=(x+y)^2-2xy=28$.`,R`$x^4+y^4=(x^2+y^2)^2-2(xy)^2$.`],
  R`$x^2+y^2=36-8=28$. Then $x^4+y^4=28^2-2\cdot4^2=784-32=\boxed{752}$.`);

A("aime-14","cnt",6,["geometry counting","cyclic polygons"],
  R`Three of the $12$ vertices of a regular $12$-gon are chosen. How many of the resulting triangles are obtuse?`,120,
  [R`A triangle inscribed in a circle is obtuse exactly when one of its three arcs exceeds a semicircle.`,R`Equivalently, all three vertices fit inside an open semicircle. Count by the vertex that comes first going clockwise.`,R`For each choice of the "first" vertex, the other two lie among the next $5$ vertices: $12\cdot\binom52$.`],
  R`A triangle inscribed in a circle is obtuse iff its three vertices lie within an open semicircle. Pick the vertex $P$ that comes first going clockwise within that semicircle; the other two vertices must be among the next $5$ vertices (so that the arc stays under $180^\circ$). That gives $12\cdot\binom52=\boxed{120}$. (Check: $\binom{12}3=220=120+60+40$ for obtuse, right, acute.)`,
  R`Right triangles use a diameter: $6$ diameters times $10$ other vertices is $60$.`);

A("aime-15","cnt",5,["inclusion-exclusion","words"],
  R`How many $5$-letter words use only the letters $A$, $B$, and $C$ and contain each of the three letters at least once?`,150,
  [R`Total words are $3^5$. Subtract those missing at least one letter.`,R`Missing a specific letter: $2^5$ words.`,R`$3^5-3\cdot2^5+3\cdot1^5$.`],
  R`By inclusion-exclusion, $3^5-\binom31 2^5+\binom32 1^5=243-96+3=\boxed{150}$.`);

A("aime-16","nt",6,["divisors","perfect cubes"],
  R`How many positive divisors of $60^5$ are perfect cubes?`,16,
  [R`Factor $60^5=2^{10}\cdot3^5\cdot5^5$.`,R`A divisor $2^a3^b5^c$ is a perfect cube iff $3\mid a$, $3\mid b$, $3\mid c$.`,R`Count multiples of $3$ in each range: $a\in\{0,3,6,9\}$, $b,c\in\{0,3\}$.`],
  R`$60^5=2^{10}3^55^5$. For a divisor to be a perfect cube, each exponent must be a multiple of $3$ within its range: $a\in\{0,3,6,9\}$ (4 choices), $b\in\{0,3\}$ (2), $c\in\{0,3\}$ (2). Total $4\cdot2\cdot2=\boxed{16}$.`);

A("aime-17","cnt",5,["partitions","casework"],
  R`How many ordered triples $(a,b,c)$ of positive integers satisfy $a\le b\le c$ and $a+b+c=20$?`,33,
  [R`Count by the smallest value $a$, then the middle value $b$.`,R`For fixed $a$, $b$ ranges from $a$ to $\lfloor(20-a)/2\rfloor$.`,R`Add up the counts for $a=1,\ldots,6$.`],
  R`Since $a\le b\le c$, $a\le6$. For each $a$ the number of valid $b$ is $\lfloor(20-a)/2\rfloor-a+1$. For $a=1$: $b=1..9$ gives $9$; $a=2$: $b=2..9$ gives $8$; $a=3$: $b=3..8$ gives $6$; $a=4$: $b=4..8$ gives $5$; $a=5$: $b=5..7$ gives $3$; $a=6$: $b=6,7$ gives $2$. Total $9+8+6+5+3+2=\boxed{33}$.`);

A("aime-18","cnt",5,["recursion","strings"],
  R`How many strings of length $8$ made of the letters $A$ and $B$ do not contain three identical letters in a row?`,68,
  [R`Let $s_n$ be the count. Classify by how the string ends.`,R`A valid string ends in a run of length exactly $1$ or $2$.`,R`$s_n=s_{n-1}+s_{n-2}$ with $s_1=2$, $s_2=4$.`],
  R`A valid string ends in a final run of length $1$ or $2$. Removing that run (of the same letter) leaves a valid string of length $n-1$ or $n-2$ ending in the other letter, so $s_n=s_{n-1}+s_{n-2}$ with $s_1=2,s_2=4$. Then $2,4,6,10,16,26,42,\boxed{68}$.`);

A("aime-19","geo",6,["lattice squares","counting"],
  R`How many squares, of any orientation, have all four vertices in the set of $16$ points $\{0,1,2,3\}\times\{0,1,2,3\}$?`,20,
  [R`First count the axis-parallel squares, then the tilted ones.`,R`A tilted square with side vector $(a,b)$ sits inside a bounding square of side $a+b$.`,R`Count by the bounding square size $k$: there are $(4-k)^2$ positions and $k$ squares inscribed in each.`],
  R`Every square is inscribed in a unique axis-parallel bounding square of side $k$ ($k=1,2,3$), and each such bounding square contains exactly $k$ squares (including itself). There are $(4-k)^2$ bounding squares of side $k$. Total: $1\cdot9+2\cdot4+3\cdot1=\boxed{20}$.`);

A("aime-20","nt",6,["difference of squares","divisors"],
  R`How many ordered pairs $(m,n)$ of positive integers satisfy $m^2-n^2=5040$?`,18,
  [R`Factor: $(m-n)(m+n)=5040$. What do $m-n$ and $m+n$ have in common?`,R`They have the same parity, and $5040$ is even, so both are even.`,R`Write them as $2u$ and $2v$ with $uv=1260$ and $u\lt v$ (since $n\gt0$).`],
  R`Let $d=m-n$, $e=m+n$, so $de=5040$ with $d\lt e$ and $d\equiv e\pmod2$. Since $5040$ is even, both are even: $d=2u$, $e=2v$, $uv=1260=2^2\cdot3^2\cdot5\cdot7$. This has $3\cdot3\cdot2\cdot2=36$ divisors and $1260$ is not a square, so there are $36/2=\boxed{18}$ pairs with $u\lt v$.`);

A("aime-21","alg",5,["floor function","sums"],
  R`Find the remainder when $\displaystyle\sum_{n=1}^{30}\left\lfloor\frac{n^2}{3}\right\rfloor$ is divided by $1000$.`,145,
  [R`Write $n^2=3\lfloor n^2/3\rfloor+r$ where $r\in\{0,1\}$ (squares are $0$ or $1$ mod $3$).`,R`$r=0$ when $3\mid n$, otherwise $r=1$.`,R`$\sum\lfloor n^2/3\rfloor=\frac{\sum n^2-\#\{3\nmid n\}}{3}$.`],
  R`$n^2\equiv0$ if $3\mid n$ and $\equiv1$ otherwise, so $\lfloor n^2/3\rfloor=\frac{n^2-r}{3}$. Over $n=1..30$: $\sum n^2=9455$ and the number of $n$ not divisible by $3$ is $20$. So the sum is $\frac{9455-20}{3}=3145$, and the remainder mod $1000$ is $\boxed{145}$.`);

A("aime-22","cnt",5,["probability","combinations"],
  R`A bag has $7$ red and $5$ blue marbles. Three marbles are drawn without replacement. The probability they are all the same color is $\frac mn$ in lowest terms. Find $m+n$.`,53,
  [R`Count all-red and all-blue draws.`,R`$\binom73+\binom53=35+10=45$ out of $\binom{12}3=220$.`,R`Reduce $\frac{45}{220}$.`],
  R`$P=\frac{\binom73+\binom53}{\binom{12}3}=\frac{45}{220}=\frac9{44}$, so $m+n=9+44=\boxed{53}$.`);

A("aime-23","cnt",7,["subsets","roots of unity","modular arithmetic"],
  R`How many subsets of $\{1,2,\ldots,10\}$ (including the empty set) have a sum of elements divisible by $5$?`,208,
  [R`Group the elements by residue mod $5$: each residue class has exactly two elements ($\{1,6\}$, $\{2,7\}$, ...).`,R`Use the roots-of-unity filter on $\prod(1+x^{k})$ with $x=\omega$, a primitive 5th root of unity.`,R`At $x=\omega$ the product is $(1+1)^2\cdot[(1+\omega)(1+\omega^2)(1+\omega^3)(1+\omega^4)]^2=4\cdot1=4$.`],
  R`Let $F(x)=\prod_{k=1}^{10}(1+x^k)$. The desired count is $\frac15\sum_{j=0}^{4}F(\omega^j)$. $F(1)=2^{10}=1024$. For $\omega\ne1$, the residues $1,\ldots,10$ cover each residue mod $5$ twice, so $F(\omega)=\left[(1+1)\prod_{r=1}^4(1+\omega^r)\right]^2=[2\cdot1]^2=4$. Hence the count is $\frac{1024+4\cdot4}{5}=\boxed{208}$.`,
  R`$\prod_{r=1}^4(1+\omega^r)=1$ because $\prod(x-\omega^r)=\frac{x^5-1}{x-1}$ evaluated at $x=-1$ gives $1$.`);

A("aime-24","nt",4,["gcd","sums"],
  R`Find the sum of all positive integers $n\le50$ such that $\gcd(n,6)=1$.`,433,
  [R`$\gcd(n,6)=1$ means $n$ is not divisible by $2$ or $3$.`,R`Such $n$ are $\equiv1$ or $5\pmod6$.`,R`List them: $1,5,7,11,\ldots,49$ and add.`],
  R`The integers $\le50$ with $n\equiv1$ or $5\pmod6$ are $1,5,7,11,13,17,19,23,25,29,31,35,37,41,43,47,49$ ($17$ numbers). Their sum is $\boxed{433}$.`);

A("aime-25","geo",7,["incenter","coordinates"],
  R`Triangle $ABC$ has $AB=13$, $BC=14$, $CA=15$, and incenter $I$. Find $AI^2+BI^2+CI^2$.`,197,
  [R`Place $B=(0,0)$, $C=(14,0)$ and find $A$: it is $(5,12)$.`,R`The inradius is $4$, and the incircle touches $BC$ at distance $s-b=6$ from $B$, so $I=(6,4)$.`,R`Compute the three squared distances.`],
  R`With $B=(0,0)$, $C=(14,0)$, $A=(5,12)$ and $s=21$, the incircle has radius $4$ and touches $BC$ at $6$ from $B$, so $I=(6,4)$. Then $AI^2=1+64=65$, $BI^2=36+16=52$, $CI^2=64+16=80$. The sum is $\boxed{197}$.`);

A("aime-26","alg",6,["floor function","casework"],
  R`For how many integers $n$ with $1\le n\le100$ is $\left\lfloor\frac n2\right\rfloor+\left\lfloor\frac n3\right\rfloor+\left\lfloor\frac n6\right\rfloor=n-1$?`,68,
  [R`Write $n=6k+r$ with $0\le r\le5$ and compute the left side.`,R`The left side equals $6k+\lfloor r/2\rfloor+\lfloor r/3\rfloor+\lfloor r/6\rfloor$.`,R`Check $r=0,1,2,3,4,5$ one by one.`],
  R`With $n=6k+r$, the left side is $6k+g(r)$ where $g(r)=\lfloor r/2\rfloor+\lfloor r/3\rfloor$ for $r\le5$: $g=0,0,1,2,3,3$ for $r=0,\ldots,5$. We need $6k+g(r)=6k+r-1$, i.e. $g(r)=r-1$: true for $r=1,2,3,4$ (not $0$ or $5$). Counting $n\le100$ with $n\bmod6\in\{1,2,3,4\}$: $64$ among $1..96$ plus $4$ among $97..100$ gives $\boxed{68}$.`);

A("aime-27","geo",7,["orthocenter","coordinates"],
  R`Triangle $ABC$ has $AB=13$, $BC=14$, $CA=15$ and orthocenter $H$. Find $4\cdot AH$.`,33,
  [R`Use coordinates: $B=(0,0)$, $C=(14,0)$, $A=(5,12)$.`,R`$H$ lies on the altitude from $A$, the line $x=5$.`,R`$BH\perp AC$ determines $H=(5,\tfrac{15}{4})$.`],
  R`With $B=(0,0)$, $C=(14,0)$, $A=(5,12)$, the altitude from $A$ is $x=5$. The condition $BH\perp AC$, where $AC$ has direction $(9,-12)$, gives $H=(5,y)$ with $5\cdot9-12y=0$, so $y=\frac{15}4$. Then $AH=12-\frac{15}4=\frac{33}{4}$, and $4\cdot AH=\boxed{33}$.`);

A("aime-28","geo",7,["tangent circles","Descartes"],
  R`Two circles of radii $4$ and $9$ are externally tangent to each other and both tangent to the same line $\ell$ (on the same side). A third circle of radius $r$ lies between them and is tangent to both circles and to $\ell$. Find $25r$.`,36,
  [R`Two circles of radii $a,b$ tangent to a line and to each other have tangent points a distance $2\sqrt{ab}$ apart on the line.`,R`Along $\ell$: $2\sqrt{4r}+2\sqrt{9r}=2\sqrt{36}$.`,R`$\sqrt r(2+3)=6$.`],
  R`Project onto the line: the contact points of two mutually tangent circles with radii $a,b$ are $2\sqrt{ab}$ apart. The outer circles are $2\sqrt{36}=12$ apart, and they must equal $2\sqrt{4r}+2\sqrt{9r}=10\sqrt r$. So $\sqrt r=\frac65$, $r=\frac{36}{25}$ and $25r=\boxed{36}$.`);

A("aime-29","geo",5,["median","Apollonius"],
  R`A triangle has side lengths $7$, $8$, and $9$. Let $m$ be the length of the median to the side of length $9$. Find $4m^2$.`,145,
  [R`Apollonius's theorem relates a median to the three sides.`,R`$m_a^2=\frac{2b^2+2c^2-a^2}{4}$.`,R`$4m^2=2\cdot49+2\cdot64-81$.`],
  R`By Apollonius's theorem, $4m^2=2b^2+2c^2-a^2=2\cdot49+2\cdot64-81=98+128-81=\boxed{145}$.`);

A("aime-30","cnt",4,["modular counting"],
  R`How many ordered pairs $(a,b)$ with $1\le a,b\le30$ have $a+b$ divisible by $7$?`,128,
  [R`Count by residues mod $7$. How many numbers in $1..30$ have each residue?`,R`Residues $1,2$ occur $5$ times; residues $3,4,5,6,0$ occur $4$ times (30 = 4·7 + 2).`,R`Pair residue $r$ with residue $-r$.`],
  R`In $1..30$, residues $1$ and $2$ each occur $5$ times and residues $0,3,4,5,6$ each occur $4$ times. Pairs need residues summing to $0$ mod $7$: $(0,0)$: $4\cdot4=16$. $(1,6)$ and $(6,1)$: $2\cdot5\cdot4=40$. $(2,5)$ and $(5,2)$: $40$. $(3,4)$ and $(4,3)$: $2\cdot4\cdot4=32$. Total $16+40+40+32=\boxed{128}$.`);

// ---------------- aime-31 .. aime-60 ----------------
A("aime-31","nt",4,["Euler's totient","coprime pairs"],
  R`How many pairs of integers $(a,b)$ with $1\le a\lt b\le30$ satisfy $\gcd(a,b)=1$?`,277,
  [R`Fix $b$. How many $a\lt b$ are coprime to $b$?`,R`For $b\ge2$ exactly $\varphi(b)$ of them.`,R`Add $\varphi(b)$ for $b=2,\ldots,30$.`],
  R`For each $b\ge2$ there are $\varphi(b)$ values $a\in[1,b)$ coprime to $b$. So the count is $\sum_{b=2}^{30}\varphi(b)=\boxed{277}$ (the full sum $\sum_{b=1}^{30}\varphi(b)$ is $278$, which includes $\varphi(1)=1$).`);

A("aime-32","cnt",3,["tilings","Fibonacci"],
  R`In how many ways can a $2\times10$ board be tiled with $1\times2$ dominoes (each placed horizontally or vertically)?`,89,
  [R`Look at the leftmost column. What can cover its squares?`,R`Either one vertical domino (leaving a $2\times(n-1)$ board) or two horizontal dominoes stacked (leaving $2\times(n-2)$).`,R`$t_n=t_{n-1}+t_{n-2}$ with $t_1=1$, $t_2=2$.`],
  R`Let $t_n$ be the number of tilings of $2\times n$. A vertical domino on the left leaves $2\times(n-1)$; two stacked horizontal dominoes leave $2\times(n-2)$. So $t_n=t_{n-1}+t_{n-2}$, $t_1=1$, $t_2=2$: $1,2,3,5,8,13,21,34,55,\boxed{89}$.`);

A("aime-33","nt",3,["modular arithmetic","sums"],
  R`What is the sum of all positive integers $n\le60$ for which $n^2+1$ is divisible by $5$?`,720,
  [R`Squares mod $5$ are $0,1,4$. When is $n^2\equiv4\pmod5$?`,R`Exactly when $n\equiv2$ or $3\pmod5$.`,R`Add $2+7+\cdots+57$ and $3+8+\cdots+58$.`],
  R`$n^2\equiv-1\equiv4\pmod5$ iff $n\equiv\pm2\pmod5$. The values are $2,7,\ldots,57$ (12 terms, sum $354$) and $3,8,\ldots,58$ (12 terms, sum $366$). Total $\boxed{720}$.`);

A("aime-34","geo",5,["Pick's theorem","lattice points"],
  R`How many points with integer coordinates lie strictly inside the triangle with vertices $(0,0)$, $(20,0)$, and $(0,15)$?`,131,
  [R`Use Pick's theorem: $A=I+\frac B2-1$.`,R`The area is $150$. Count boundary lattice points on each side with gcd.`,R`$B=20+15+\gcd(20,15)=40$.`],
  R`The area is $\frac12\cdot20\cdot15=150$. Boundary points: the legs contribute $20$ and $15$ segments, and the hypotenuse has $\gcd(20,15)=5$ segments, so $B=20+15+5=40$. By Pick's theorem, $I=A-\frac B2+1=150-20+1=\boxed{131}$.`);

A("aime-35","cnt",5,["recursion","subsets"],
  R`How many subsets of $\{1,2,\ldots,9\}$ (including the empty set) contain no three consecutive integers?`,274,
  [R`Think of each subset as a binary string of length $9$ with no $111$.`,R`Classify by how a valid string ends: in $0$, in $01$, or in $011$.`,R`$a_n=a_{n-1}+a_{n-2}+a_{n-3}$ with $a_1=2$, $a_2=4$, $a_3=7$.`],
  R`Let $a_n$ count binary strings of length $n$ with no $111$. Looking at how a valid string ends (a $0$, $01$, or $011$) gives $a_n=a_{n-1}+a_{n-2}+a_{n-3}$ with $a_1=2,a_2=4,a_3=7$. Then $7,13,24,44,81,149,\boxed{274}$ for $n=9$.`);

A("aime-36","nt",6,["CRT","Euler's theorem"],
  R`Find the remainder when $3^{100}+4^{100}$ is divided by $1000$.`,377,
  [R`Work modulo $8$ and modulo $125$ separately.`,R`Mod $8$: $3^2\equiv1$ and $4^2\equiv0$. Mod $125$: $\varphi(125)=100$.`,R`The residues are $1\pmod8$ and $2\pmod{125}$. Combine with CRT.`],
  R`Mod $8$: $3^{100}=(3^2)^{50}\equiv1$ and $4^{100}\equiv0$, so the sum is $\equiv1$. Mod $125$: both $3$ and $4$ are coprime to $5$, and $\varphi(125)=100$, so each power is $\equiv1$ and the sum is $\equiv2$. Solve $x\equiv2\pmod{125}$, $x\equiv1\pmod8$: $x=2+125k$ with $5k\equiv-1\equiv7\pmod8$, so $k\equiv3$ and $x=\boxed{377}$.`);

A("aime-37","nt",6,["sums of two squares","lattice points"],
  R`How many ordered pairs $(x,y)$ of integers satisfy $x^2+y^2=2025$?`,12,
  [R`$2025=3^4\cdot5^2=45^2$. The prime $3\equiv3\pmod4$ appears to an even power, which is what allows representations.`,R`The number of representations of $n$ as a sum of two squares is $4\prod(e_i+1)$ over primes $p_i\equiv1\pmod4$, provided every prime $\equiv3\pmod 4$ has an even exponent.`,R`Only $5^2$ counts: $4\cdot(2+1)$. List them to check.`],
  R`Since the prime $3\equiv3\pmod4$ appears to an even power, representations exist, and their number is $4(2+1)=12$ (from $5^2$). Explicitly: $(\pm45,0)$, $(0,\pm45)$, $(\pm27,\pm36)$, $(\pm36,\pm27)$, which is $4+8=\boxed{12}$.`);

A("aime-38","cnt",2,["combinations"],
  R`How many four-letter strings can be formed from the letters $A$ through $J$ (ten letters) so that the letters appear in strictly increasing alphabetical order?`,210,
  [R`The string is determined by which four letters it uses.`,R`Order is forced, so this is a choice of $4$ letters from $10$.`,R`$\binom{10}{4}$.`],
  R`Each such string corresponds to exactly one $4$-element subset of the ten letters (written in alphabetical order), so the count is $\binom{10}{4}=\boxed{210}$.`);

A("aime-39","geo",6,["exradii","triangle identities"],
  R`Triangle $ABC$ has sides $13$, $14$, and $15$, and its three excircles have radii $r_a$, $r_b$, $r_c$. Find $2(r_a+r_b+r_c)$.`,73,
  [R`An exradius is $r_a=\frac{K}{s-a}$ where $K$ is the area and $a$ the opposite side.`,R`$K=84$ and $s=21$.`,R`The exradii are $\frac{84}{7}=12$, $\frac{84}{6}=14$, $\frac{84}{8}=\frac{21}{2}$.`],
  R`With $K=84$ and $s=21$: the exradius opposite side $14$ is $\frac{84}{21-14}=12$, opposite $15$ is $\frac{84}{6}=14$, and opposite $13$ is $\frac{84}{8}=\frac{21}2$. The sum is $\frac{73}{2}$, so $2(r_a+r_b+r_c)=\boxed{73}$. (Check: $r_a+r_b+r_c=4R+r=\frac{65}2+4$.)`);

A("aime-40","alg",5,["recurrences","power sums"],
  R`A real number $x$ satisfies $x+\frac1x=7$. The number $x^5+\frac1{x^5}$ is an integer. Find its remainder when divided by $1000$.`,127,
  [R`Let $L_n=x^n+x^{-n}$. Find a recurrence from $x+\frac1x=7$.`,R`$L_n=7L_{n-1}-L_{n-2}$ with $L_0=2$, $L_1=7$.`,R`Compute $L_2,L_3,L_4,L_5$.`],
  R`Since $\left(x^{n-1}+x^{-(n-1)}\right)\left(x+x^{-1}\right)=L_n+L_{n-2}$, we get $L_n=7L_{n-1}-L_{n-2}$. So $L_2=47$, $L_3=322$, $L_4=2207$, $L_5=15127$. The remainder mod $1000$ is $\boxed{127}$.`);

A("aime-41","cnt",4,["probability","dice"],
  R`Three fair six-sided dice are rolled. The probability that the sum is $12$ is $\frac mn$ in lowest terms. Find $m+n$.`,241,
  [R`Count ordered triples with sum $12$, out of $216$.`,R`List the multisets of three values in $[1,6]$ with sum $12$ and count their orderings.`,R`There are $25$ ordered triples, and $\gcd(25,216)=1$.`],
  R`The multisets and their orderings: $\{6,5,1\}$ ($6$), $\{6,4,2\}$ ($6$), $\{6,3,3\}$ ($3$), $\{5,5,2\}$ ($3$), $\{5,4,3\}$ ($6$), $\{4,4,4\}$ ($1$): total $25$. So $P=\frac{25}{216}$ and $m+n=\boxed{241}$.`);

A("aime-42","nt",5,["divisor counting","factorials"],
  R`How many positive divisors of $10!$ are multiples of $6$?`,192,
  [R`$10!=2^8\cdot3^4\cdot5^2\cdot7$.`,R`A divisor is a multiple of $6$ iff it has at least one $2$ and at least one $3$.`,R`Exponent choices: $2$: $1..8$, $3$: $1..4$, $5$: $0..2$, $7$: $0..1$.`],
  R`$10!=2^8\cdot3^4\cdot5^2\cdot7^1$. A divisor $2^a3^b5^c7^d$ is a multiple of $6$ iff $a\ge1$ and $b\ge1$. The number of choices is $8\cdot4\cdot3\cdot2=\boxed{192}$.`);

A("aime-43","geo",5,["similar triangles","area ratios"],
  R`Square $ABCD$ has side length $12$, and $E$ is the midpoint of $CD$. Segments $AE$ and $BD$ meet at $F$. Find the area of triangle $BFC$.`,48,
  [R`Triangles $ABF$ and $EDF$ are similar (parallel sides $AB\parallel DE$).`,R`The ratio of similarity is $AB:DE=12:6=2:1$, so $BF:FD=2:1$.`,R`$[BFC]=\frac23[BCD]$, since they share the vertex $C$ and have bases along $BD$.`],
  R`Since $AB\parallel DE$, $\triangle ABF\sim\triangle EDF$ with ratio $AB:DE=2:1$, so $BF=\frac23BD$. Triangles $BFC$ and $BDC$ share the apex $C$ and have bases on line $BD$, so $[BFC]=\frac23[BDC]=\frac23\cdot72=\boxed{48}$.`);

A("aime-44","alg",5,["series","modular arithmetic"],
  R`Find the remainder when $\displaystyle\sum_{k=1}^{20}k\cdot2^k$ is divided by $1000$.`,890,
  [R`Find a closed form for $\sum_{k=1}^nk2^k$. Try subtracting $S$ from $2S$.`,R`$\sum_{k=1}^nk2^k=(n-1)2^{n+1}+2$.`,R`For $n=20$ that is $19\cdot2^{21}+2$.`],
  R`With $S=\sum_{k=1}^nk2^k$, compute $2S-S$ to get $S=(n-1)2^{n+1}+2$. For $n=20$: $19\cdot2097152+2=39845890$, whose remainder mod $1000$ is $\boxed{890}$.`);

A("aime-45","cnt",5,["residue classes","combinations"],
  R`How many $3$-element subsets of $\{1,2,\ldots,20\}$ have a sum divisible by $3$?`,384,
  [R`Sort the numbers by residue mod $3$.`,R`There are $6$ numbers $\equiv0$, $7$ numbers $\equiv1$, and $7$ numbers $\equiv2$.`,R`The sum is $\equiv0$ iff the three residues are all equal, or are $0,1,2$ in some order.`],
  R`Residue classes have sizes $6$ ($\equiv0$), $7$ ($\equiv1$), $7$ ($\equiv2$). A triple sums to $0\pmod3$ iff the residues are all equal or all different. Count: $\binom63+\binom73+\binom73+6\cdot7\cdot7=20+35+35+294=\boxed{384}$.`);

A("aime-46","nt",6,["floor function","divisibility"],
  R`For how many positive integers $n\le1000$ does $\lfloor\sqrt n\rfloor$ divide $n$?`,92,
  [R`Group $n$ by $k=\lfloor\sqrt n\rfloor$: those with $k^2\le n\le k^2+2k$.`,R`In that block, which numbers are multiples of $k$?`,R`$k^2$, $k^2+k$, and $k^2+2k$. Watch the last block, which is cut off at $1000$.`],
  R`If $k=\lfloor\sqrt n\rfloor$ then $k^2\le n\le k^2+2k$, and the multiples of $k$ in that block are exactly $k^2$, $k^2+k$, $k^2+2k$ (3 numbers). This covers $k=1,\ldots,30$ completely (the blocks end at $960$): $90$ numbers. For $k=31$ the block is $961..1023$, and the multiples $961$ and $992$ are $\le1000$ (the third, $1023$, is not). Total $90+2=\boxed{92}$.`);

A("aime-47","geo",4,["right triangles","altitude"],
  R`A right triangle has legs $20$ and $21$ and hypotenuse $29$. The altitude from the right angle to the hypotenuse has length $\frac mn$ in lowest terms. Find $m+n$.`,449,
  [R`Compute the area two ways.`,R`$\frac12\cdot20\cdot21=\frac12\cdot29\cdot h$.`,R`$h=\frac{420}{29}$, and $\gcd(420,29)=1$.`],
  R`Area $=\frac12\cdot20\cdot21=210=\frac12\cdot29\cdot h$, so $h=\frac{420}{29}$ in lowest terms ($29$ is prime and does not divide $420$). So $m+n=420+29=\boxed{449}$.`);

A("aime-48","cnt",6,["cyclic polygons","complementary counting"],
  R`Three of the $14$ vertices of a regular $14$-gon are chosen. How many of the resulting triangles are acute?`,70,
  [R`Total triangles: $\binom{14}3=364$. Count the right and obtuse ones and subtract.`,R`Right triangles use a diameter: $7$ diameters, $12$ choices for the third vertex.`,R`Obtuse: all three vertices in an open semicircle. First vertex $14$ ways, the other two among the next $6$: $14\binom62$.`],
  R`$\binom{14}3=364$. Right triangles have a diameter as hypotenuse: $7\cdot12=84$. Obtuse triangles have all three vertices within an open semicircle: choose the first vertex clockwise ($14$ ways) and the other two among the next $6$ vertices: $14\binom62=210$. Acute $=364-84-210=\boxed{70}$.`);

A("aime-49","cnt",4,["partitions"],
  R`How many ordered triples $(a,b,c)$ of nonnegative integers satisfy $a\ge b\ge c$ and $a+b+c=15$?`,27,
  [R`This counts partitions of $15$ into at most $3$ parts.`,R`For fixed $c$, $b$ ranges from $c$ up to $\lfloor(15-c)/2\rfloor$.`,R`Sum the counts for $c=0,\ldots,5$.`],
  R`For fixed $c$, $b$ runs from $c$ to $\lfloor(15-c)/2\rfloor$: $c=0$: $b=0..7$ ($8$), $c=1$: $1..7$ ($7$), $c=2$: $2..6$ ($5$), $c=3$: $3..6$ ($4$), $c=4$: $4..5$ ($2$), $c=5$: $5$ ($1$). Total $8+7+5+4+2+1=\boxed{27}$.`);

A("aime-50","nt",5,["logarithms","number of digits"],
  R`How many digits does $3^{500}$ have? (Use $\log_{10}3\approx0.47712$.)`,239,
  [R`The number of digits of $N$ is $\lfloor\log_{10}N\rfloor+1$.`,R`$\log_{10}3^{500}=500\log_{10}3$.`,R`$500\cdot0.47712=238.56$.`],
  R`$\log_{10}3^{500}=500\cdot0.47712\ldots\approx238.56$, so $3^{500}$ has $\lfloor238.56\rfloor+1=\boxed{239}$ digits.`);

A("aime-51","cnt",5,["derangements","inclusion-exclusion"],
  R`In how many ways can the numbers $1,2,3,4,5,6$ be arranged in a row so that no number is in its own position (no $i$ is in the $i$th place)?`,265,
  [R`Inclusion-exclusion over the set of positions that are fixed.`,R`$D_6=6!-\binom61 5!+\binom62 4!-\binom63 3!+\binom64 2!-\binom65 1!+\binom66 0!$.`,R`$720-720+360-120+30-6+1$.`],
  R`By inclusion-exclusion, $D_6=720-720+360-120+30-6+1=\boxed{265}$. (Check with $D_n=(n-1)(D_{n-1}+D_{n-2})=5(44+9)=265$.)`);

A("aime-52","alg",5,["Fibonacci","modular arithmetic"],
  R`The Fibonacci numbers are $F_1=F_2=1$ and $F_{n+2}=F_{n+1}+F_n$. Find the remainder when $F_{100}$ is divided by $1000$.`,75,
  [R`Use fast doubling, reducing mod $1000$ along the way.`,R`Fast doubling: $F_{2n}=F_n(2F_{n+1}-F_n)$ and $F_{2n+1}=F_n^2+F_{n+1}^2$.`,R`Build $F_{100}$ from $F_{50}$, then $F_{25}$, and so on.`],
  R`Using fast doubling from small indices and reducing modulo $1000$ at each step (equivalently, $F_{100}=354224848179261915075$), we find $F_{100}\equiv\boxed{75}\pmod{1000}$. (Check mod $8$: the Fibonacci sequence has period $12$ there, $100\equiv4\pmod{12}$, and $F_4=3\equiv75\pmod8$.)`);

A("aime-53","geo",4,["lattice paths","gcd"],
  R`The diagonal of a $30\times40$ rectangle (made of unit squares) runs from one corner to the opposite corner. Through how many unit squares does it pass?`,60,
  [R`Each time the diagonal crosses a vertical or horizontal grid line, it enters a new square.`,R`It crosses $39$ vertical and $29$ horizontal interior lines, but sometimes crosses both at once, at a lattice point.`,R`There are $\gcd(30,40)-1=9$ such lattice points. Squares: $1+39+29-9$.`],
  R`The diagonal starts in one square, and each crossing of an interior grid line (there are $39+29=68$) enters a new square, except at lattice points where two lines are crossed at once, which happens $\gcd(30,40)-1=9$ times. So the number of squares is $1+68-9=\boxed{60}$, which equals $30+40-\gcd(30,40)$.`);

A("aime-54","nt",3,["factorials","prime factors"],
  R`With how many zeros does the decimal representation of $1000!$ end?`,249,
  [R`Each trailing zero is a factor of $10=2\cdot5$, and factors of $5$ are scarcer.`,R`Count the multiples of $5$, $25$, $125$, $625$.`,R`$200+40+8+1$.`],
  R`The number of factors of $5$ in $1000!$ is $\lfloor\frac{1000}5\rfloor+\lfloor\frac{1000}{25}\rfloor+\lfloor\frac{1000}{125}\rfloor+\lfloor\frac{1000}{625}\rfloor=200+40+8+1=\boxed{249}$.`);

A("aime-55","cnt",6,["circular arrangements","non-adjacent"],
  R`In how many ways can $4$ vertices of a regular $12$-gon be chosen so that no two chosen vertices are adjacent?`,105,
  [R`Cut the circle open by deciding whether vertex $1$ is chosen.`,R`If vertex $1$ is not chosen, the other $11$ vertices form a line. If it is chosen, vertices $2$ and $12$ are excluded.`,R`Line counts: choosing $k$ non-adjacent from $m$ in a row is $\binom{m-k+1}{k}$.`],
  R`Case 1: vertex $1$ is not chosen. Then we choose $4$ non-adjacent vertices from the $11$ vertices $2,\ldots,12$ in a row, in $\binom{11-4+1}{4}=\binom84=70$ ways. Case 2: vertex $1$ is chosen. Then $2$ and $12$ are excluded, and we choose $3$ non-adjacent vertices from $3,\ldots,11$ ($9$ in a row): $\binom{9-3+1}{3}=\binom73=35$ ways. Total $70+35=\boxed{105}$.`);

A("aime-56","alg",4,["sums","binomial coefficients"],
  R`Find $\displaystyle\sum_{k=1}^{8}\left(k^3-6k^2+11k-6\right)$.`,420,
  [R`Factor the cubic: $k^3-6k^2+11k-6=(k-1)(k-2)(k-3)$.`,R`$(k-1)(k-2)(k-3)=6\binom{k-1}{3}$.`,R`$\sum_{k=1}^8\binom{k-1}3=\binom84$ by the hockey-stick identity.`],
  R`The cubic factors as $(k-1)(k-2)(k-3)=6\binom{k-1}{3}$. By the hockey-stick identity, $\sum_{k=1}^{8}\binom{k-1}3=\binom84=70$. So the sum is $6\cdot70=\boxed{420}$.`);

A("aime-57","nt",4,["quadratic residues","counting"],
  R`For how many integers $n$ with $1\le n\le200$ is $n^2+n+1$ divisible by $7$?`,58,
  [R`Test $n=0,1,\ldots,6$ modulo $7$.`,R`$n^2+n+1\equiv0\pmod7$ exactly for $n\equiv2$ and $n\equiv4$.`,R`Count $n\le200$ in each of those two residue classes.`],
  R`Checking residues: $n=2$ gives $7\equiv0$ and $n=4$ gives $21\equiv0$; the others fail. So $n\equiv2$ or $4\pmod7$. In $1..200$: $n\equiv2$ gives $2,9,\ldots,198$ ($29$ numbers) and $n\equiv4$ gives $4,11,\ldots,200$ ($29$ numbers). Total $\boxed{58}$.`);

A("aime-58","cnt",7,["expected value","Markov chains"],
  R`A fair six-sided die is rolled repeatedly until two $6$'s appear in a row. What is the expected number of rolls?`,42,
  [R`Let $E_0$ be the expected remaining rolls from scratch, and $E_1$ the expected remaining rolls right after rolling a single $6$.`,R`$E_0=1+\frac56E_0+\frac16E_1$ and $E_1=1+\frac56E_0$.`,R`Substitute the second equation into the first.`],
  R`$E_0=1+\frac56E_0+\frac16E_1$ and $E_1=1+\frac56E_0$ (a second $6$ with probability $\frac16$ ends the process). Substituting: $E_0=1+\frac56E_0+\frac16+\frac5{36}E_0$, so $\frac{1}{36}E_0=\frac76$ and $E_0=\boxed{42}$.`);

A("aime-59","geo",4,["polygon area","decomposition"],
  R`A hexagon has vertices, in order, $(0,0)$, $(4,0)$, $(6,3)$, $(4,6)$, $(0,6)$, and $(-2,3)$. What is its area?`,36,
  [R`Split it into a rectangle and two triangles.`,R`The rectangle $[0,4]\times[0,6]$ has area $24$.`,R`The two side triangles have base $6$ and height $2$.`],
  R`The hexagon is the rectangle with corners $(0,0)$, $(4,0)$, $(4,6)$, $(0,6)$ (area $24$) plus two triangles with vertices $(4,0),(6,3),(4,6)$ and $(0,0),(-2,3),(0,6)$, each with base $6$ and height $2$ (area $6$ each). Total $24+6+6=\boxed{36}$.`);

A("aime-60","nt",5,["squarefree part","counting"],
  R`How many ordered pairs $(m,n)$ with $1\le m,n\le20$ have the property that $mn$ is a perfect square?`,42,
  [R`Write each number as (squarefree part) $\times$ (a perfect square).`,R`$mn$ is a square iff $m$ and $n$ have the same squarefree part.`,R`Group $1,\ldots,20$ by squarefree part and add the squares of the group sizes.`],
  R`$mn$ is a perfect square iff $m$ and $n$ have the same squarefree part. Group $1..20$ by squarefree part: $\{1,4,9,16\}$ (4), $\{2,8,18\}$ (3), $\{3,12\}$ (2), $\{5,20\}$ (2), and the remaining $9$ numbers are in groups of size $1$. The number of ordered pairs is $16+9+4+4+9=\boxed{42}$.`);
