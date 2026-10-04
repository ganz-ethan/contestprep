// 25 original AIME-style problems (integer answers 0-999). Answers are brute-force verified by verify_extra.js.
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
