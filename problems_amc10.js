// 34 original AMC 10-style problems.
M("a10-7","amc10","alg",3,["Vieta","roots"],
  R`The equation $x^2-10x+k=0$ has two real roots that differ by $4$. What is $k$?`,
  ["16","18","21","24","25"],"21",
  [R`The roots sum to $10$ (Vieta). If they differ by $4$, what are they?`,R`Roots $a$ and $a+4$ with $2a+4=10$.`,R`The roots are $3$ and $7$; $k$ is their product.`],
  R`The roots sum to $10$ and differ by $4$, so they are $3$ and $7$. Then $k=3\cdot7=\boxed{21}$.`);

M("a10-8","amc10","nt",4,["divisors","perfect squares"],
  R`How many positive divisors of $2^3\cdot3^4\cdot5$ are perfect squares?`,
  ["4","6","8","10","12"],"6",
  [R`A divisor $2^a3^b5^c$ is a perfect square exactly when $a,b,c$ are all even.`,R`$a\in\{0,2\}$, $b\in\{0,2,4\}$, $c\in\{0\}$.`,R`Multiply the number of choices.`],
  R`We need even exponents: $a\in\{0,2\}$ (2 choices), $b\in\{0,2,4\}$ (3 choices), $c=0$ (1 choice). Total $2\cdot3\cdot1=\boxed{6}$.`);

M("a10-9","amc10","cnt",3,["committees","combinations"],
  R`A club has $10$ members. In how many ways can it choose a committee of $3$ members and then appoint one of those three as chair?`,
  ["120","240","360","720","1000"],"360",
  [R`Pick the chair first, then the other two members.`,R`$10$ choices for the chair.`,R`Then $\binom92$ ways to choose the other two.`],
  R`Choose the chair ($10$ ways), then choose $2$ other members from the remaining $9$ ($\binom92=36$ ways): $10\cdot36=\boxed{360}$.`,
  R`$\binom{10}{3}=120$ counts committees only, with no chair.`);

M("a10-10","amc10","geo",3,["circles","chords"],
  R`A circle has radius $5$. A chord of the circle has length $8$. What is the area of the triangle whose vertices are the center of the circle and the two endpoints of the chord?`,
  ["6","12","15","20","24"],"12",
  [R`Drop a perpendicular from the center to the chord. It bisects the chord.`,R`Half-chord $=4$, radius $=5$.`,R`The distance from the center to the chord is $3$.`],
  R`The perpendicular from the center to the chord bisects it, forming a right triangle with legs $4$ and $d$ and hypotenuse $5$, so $d=3$. The area is $\frac12\cdot8\cdot3=\boxed{12}$.`);

M("a10-11","amc10","alg",3,["function composition"],
  R`Let $f(x)=2x+3$ and $g(x)=x^2-1$. What is $g(f(2))+f(g(2))$?`,
  ["48","53","57","60","66"],"57",
  [R`Work from the inside out.`,R`$f(2)=7$, so $g(f(2))=g(7)$.`,R`$g(2)=3$, so $f(g(2))=f(3)$.`],
  R`$f(2)=7$ and $g(7)=48$. $g(2)=3$ and $f(3)=9$. The sum is $48+9=\boxed{57}$.`);

M("a10-12","amc10","nt",4,["factorials","remainders"],
  R`What is the remainder when $1!+2!+3!+\cdots+100!$ is divided by $12$?`,
  ["3","6","9","10","11"],"9",
  [R`Many terms are multiples of $12$. Find the first factorial divisible by $12$.`,R`$4!=24$ is a multiple of $12$, and so is every larger factorial.`,R`Only $1!+2!+3!$ matters.`],
  R`$n!$ is divisible by $12$ for every $n\ge4$ (since $4!=24$). So the remainder equals that of $1+2+6=9$, which is $\boxed{9}$.`);

M("a10-13","amc10","cnt",4,["probability","complementary counting"],
  R`A fair coin is flipped $4$ times. What is the probability of getting at least $2$ heads?`,
  ["1/2","9/16","5/8","11/16","3/4"],"11/16",
  [R`Use the complement: fewer than $2$ heads.`,R`Zero heads: $1$ way. One head: $4$ ways.`,R`$1-\frac{5}{16}$.`],
  R`There are $16$ outcomes. Fewer than $2$ heads occurs in $1+4=5$ of them. So $P=1-\frac5{16}=\boxed{\tfrac{11}{16}}$.`);

M("a10-14","amc10","geo",4,["inradius","circumradius","right triangle"],
  R`A right triangle has sides $5$, $12$, and $13$. What is the sum of the radius of its inscribed circle and the radius of its circumscribed circle?`,
  ["6","15/2","8","17/2","9"],"17/2",
  [R`In a right triangle, the circumcenter is the midpoint of the hypotenuse.`,R`Circumradius $=\frac{13}2$.`,R`Inradius $=\frac{a+b-c}2$ for a right triangle with hypotenuse $c$. Or use $A=rs$.`],
  R`Circumradius: $\frac{13}2$. Inradius: area $30$, semiperimeter $15$, so $r=2$. Sum: $2+\frac{13}2=\boxed{\tfrac{17}2}$.`);

M("a10-15","amc10","alg",3,["arithmetic series"],
  R`What is the sum of the first $50$ terms of the arithmetic sequence $3,7,11,15,\ldots$?`,
  ["4950","5000","5050","5100","5200"],"5050",
  [R`The common difference is $4$. The $50$th term is $3+49\cdot4$.`,R`The $50$th term is $199$.`,R`Sum $=\frac{n}{2}(\text{first}+\text{last})$.`],
  R`The $50$th term is $3+49\cdot4=199$. The sum is $\frac{50}{2}(3+199)=25\cdot202=\boxed{5050}$.`);

M("a10-16","amc10","nt",4,["Euler's totient","gcd"],
  R`How many positive integers $n\le100$ satisfy $\gcd(n,100)=1$?`,
  ["20","30","40","50","60"],"40",
  [R`$\gcd(n,100)=1$ means $n$ is not divisible by $2$ or $5$.`,R`Remove the multiples of $2$ and of $5$ using inclusion-exclusion.`,R`$100-50-20+10$.`],
  R`Multiples of $2$: $50$. Multiples of $5$: $20$. Multiples of $10$: $10$. So $100-(50+20-10)=\boxed{40}$. (Equivalently $\varphi(100)=100\cdot\frac12\cdot\frac45$.)`);

M("a10-17","amc10","cnt",5,["stars and bars","digits"],
  R`How many four-digit positive integers have digits that sum to $3$?`,
  ["6","8","10","12","20"],"10",
  [R`The first digit must be at least $1$. Reduce it by $1$ to make all digits nonnegative.`,R`Now count nonnegative solutions to $a+b+c+d=2$.`,R`$\binom{2+3}{3}$.`],
  R`Let the digits be $d_1d_2d_3d_4$ with $d_1\ge1$. Put $d_1'=d_1-1$. Then $d_1'+d_2+d_3+d_4=2$ has $\binom{5}{3}=\boxed{10}$ solutions, and none has a digit above $9$.`);

M("a10-18","amc10","geo",4,["right triangles","altitude"],
  R`In right triangle $ABC$, $\angle B=90^\circ$, $AB=6$, and $BC=8$. The altitude from $B$ meets $AC$ at $D$. What is $AD$?`,
  ["3","3.6","4","4.8","5"],"3.6",
  [R`$AC=10$ by the Pythagorean theorem.`,R`Triangles $ABD$ and $ACB$ are similar.`,R`$\frac{AD}{AB}=\frac{AB}{AC}$.`],
  R`$AC=10$. By similarity, $AB^2=AD\cdot AC$, so $AD=\frac{36}{10}=\boxed{3.6}$.`);

M("a10-19","amc10","alg",4,["radical equations","extraneous roots"],
  R`What is the solution of $\sqrt{x+7}=x-5$?`,
  ["2","5","9","11","18"],"9",
  [R`Square both sides.`,R`$x+7=x^2-10x+25$, so $x^2-11x+18=0$.`,R`Roots are $2$ and $9$. Check each in the original equation.`],
  R`Squaring: $x^2-11x+18=0$, so $x=2$ or $x=9$. Check: $x=2$ gives $\sqrt9=3\ne-3$ (extraneous). $x=9$ gives $\sqrt{16}=4=9-5$. So $x=\boxed{9}$.`,
  R`Squaring can introduce false solutions. Always plug back in.`);

M("a10-20","amc10","nt",5,["divisibility","long division trick"],
  R`What is the sum of all positive integers $n$ such that $n+2$ divides $n^2+8$?`,
  ["13","15","17","20","22"],"17",
  [R`Rewrite $n^2+8$ as a multiple of $n+2$ plus a remainder.`,R`$n^2+8=(n+2)(n-2)+12$.`,R`So $n+2$ must divide $12$, and $n\ge1$ means $n+2\ge3$.`],
  R`Since $n^2+8=(n+2)(n-2)+12$, we need $n+2\mid12$. With $n+2\ge3$: $n+2\in\{3,4,6,12\}$, so $n\in\{1,2,4,10\}$ with sum $\boxed{17}$.`);

M("a10-21","amc10","cnt",4,["expected value"],
  R`A fair six-sided die is rolled. If the result is even, you win that many dollars. If the result is odd, you lose $1$ dollar. What is your expected winnings?`,
  [R`$\$1.00$`,R`$\$1.50$`,R`$\$2.00$`,R`$\$2.50$`,R`$\$3.00$`],R`$\$1.50$`,
  [R`Expected value $=\sum(\text{outcome})\cdot(\text{probability})$.`,R`Even rolls: $2,4,6$ each with probability $\frac16$. Odd rolls lose $1$ each.`,R`$\frac{2+4+6-3}{6}$.`],
  R`$E=\frac{2+4+6}{6}-\frac{3\cdot1}{6}=2-\frac12=\boxed{1.50}$ dollars.`);

M("a10-22","amc10","geo",4,["hexagon","equilateral triangle"],
  R`What is the area of a regular hexagon with side length $2$?`,
  [R`$3\sqrt3$`,R`$4\sqrt3$`,R`$6\sqrt3$`,R`$8\sqrt3$`,R`$12\sqrt3$`],R`$6\sqrt3$`,
  [R`A regular hexagon splits into $6$ equilateral triangles from its center.`,R`Each has side $2$, area $\frac{\sqrt3}4\cdot4=\sqrt3$.`,R`Multiply by $6$.`],
  R`Six equilateral triangles of side $2$, each with area $\sqrt3$, give $\boxed{6\sqrt3}$.`);

M("a10-23","amc10","alg",4,["symmetric sums"],
  R`If $x+y=7$ and $xy=10$, what is $x^3+y^3$?`,
  ["91","119","133","147","175"],"133",
  [R`Use $x^3+y^3=(x+y)^3-3xy(x+y)$.`,R`$(x+y)^3=343$.`,R`$3xy(x+y)=3\cdot10\cdot7=210$.`],
  R`$x^3+y^3=(x+y)^3-3xy(x+y)=343-210=\boxed{133}$. (Check: $x,y=2,5$ gives $8+125=133$.)`);

M("a10-24","amc10","nt",4,["factorials","trailing zeros"],
  R`With how many zeros does the decimal representation of $100!$ end?`,
  ["20","22","24","25","26"],"24",
  [R`Each trailing zero comes from a factor of $10=2\cdot5$. There are far more $2$'s than $5$'s.`,R`Count the factors of $5$ in $100!$.`,R`$\lfloor100/5\rfloor+\lfloor100/25\rfloor$.`],
  R`The number of factors of $5$ is $\lfloor\tfrac{100}{5}\rfloor+\lfloor\tfrac{100}{25}\rfloor=20+4=\boxed{24}$.`,
  R`Multiples of $25$ contribute two factors of $5$, so they must be counted again.`);

M("a10-25","amc10","cnt",4,["stars and bars"],
  R`In how many ways can $5$ identical balls be placed into $3$ distinct boxes (boxes may be empty)?`,
  ["10","15","21","35","243"],"21",
  [R`This is the number of nonnegative solutions to $a+b+c=5$.`,R`Use stars and bars: arrange $5$ balls and $2$ dividers.`,R`$\binom{7}{2}$.`],
  R`There are $\binom{5+2}{2}=\boxed{21}$ ways.`,
  R`$3^5=243$ would be right only if the balls were distinguishable.`);

M("a10-26","amc10","geo",4,["area","circles","quarter-circles"],
  R`A square has side length $4$. A quarter-circle of radius $2$ is drawn inside the square at each corner. What is the area of the part of the square not covered by the quarter-circles?`,
  [R`$16-\pi$`,R`$16-2\pi$`,R`$16-4\pi$`,R`$16-8\pi$`,R`$4\pi$`],R`$16-4\pi$`,
  [R`How much area do four quarter-circles have in total?`,R`Four quarter-circles of radius $2$ make one full circle's worth of area.`,R`$\pi\cdot2^2$.`],
  R`The four quarter-circles together have area $\pi\cdot2^2=4\pi$. They do not overlap (adjacent ones just touch), so the uncovered area is $\boxed{16-4\pi}$.`);

M("a10-27","amc10","alg",5,["geometric sequences"],
  R`Three positive numbers form a geometric sequence with sum $21$ and product $216$. What is the largest of the three numbers?`,
  ["9","10","12","14","18"],"12",
  [R`Write the terms as $\frac br,b,br$. The product is $b^3$.`,R`$b^3=216$, so $b=6$.`,R`$\frac6r+6+6r=21$ gives $2r^2-5r+2=0$, so $r=2$ or $\frac12$.`],
  R`With middle term $b$, the product is $b^3=216$, so $b=6$. Then $6/r+6r=15$ gives $r=2$ or $\frac12$. The numbers are $3,6,12$. The largest is $\boxed{12}$.`);

M("a10-28","amc10","nt",5,["factorials","divisibility"],
  R`What is the smallest positive integer $n$ such that $n!$ is divisible by $1000$?`,
  ["10","12","15","20","25"],"15",
  [R`$1000=2^3\cdot5^3$. The $5$'s are the bottleneck.`,R`You need three factors of $5$ in $n!$.`,R`$5,10,15$ give three $5$'s.`],
  R`$n!$ needs $5^3$. The factors of $5$ appear at $5,10,15,\ldots$, so the third appears at $15$. Plenty of $2$'s exist by then. So $n=\boxed{15}$ (and $14!$ has only two $5$'s).`);

M("a10-29","amc10","cnt",5,["probability","combinations"],
  R`Three cards are drawn at random without replacement from a standard $52$-card deck. What is the probability that all three are hearts?`,
  ["11/850","1/64","1/50","1/27","1/4"],"11/850",
  [R`Count favorable selections over total selections.`,R`$\binom{13}{3}=286$ and $\binom{52}{3}=22100$.`,R`Or multiply: $\frac{13}{52}\cdot\frac{12}{51}\cdot\frac{11}{50}$.`],
  R`$\dfrac{\binom{13}3}{\binom{52}3}=\dfrac{286}{22100}=\boxed{\tfrac{11}{850}}$.`,
  R`The probabilities change after each card is removed. Do not use $(\frac14)^3=\frac1{64}$.`);

M("a10-30","amc10","geo",4,["hexagon"],
  R`What is the area of a regular hexagon with side length $4$?`,
  [R`$12\sqrt3$`,R`$16\sqrt3$`,R`$24\sqrt3$`,R`$32\sqrt3$`,R`$48\sqrt3$`],R`$24\sqrt3$`,
  [R`Split into $6$ equilateral triangles.`,R`Each has area $\frac{\sqrt3}4\cdot16=4\sqrt3$.`,R`Multiply by $6$.`],
  R`$6\cdot\frac{\sqrt3}{4}\cdot4^2=\boxed{24\sqrt3}$.`);

M("a10-31","amc10","alg",5,["absolute value","casework"],
  R`What is the sum of all real solutions of $|x-3|+|x+2|=9$?`,
  ["-1","0","1","5","9"],"1",
  [R`Break the line at $x=-2$ and $x=3$ and handle each region.`,R`For $-2\le x\le3$ the left side is constant $5$, so there is no solution there.`,R`For $x\ge3$: $2x-1=9$. For $x\le-2$: $-2x+1=9$.`],
  R`If $x\ge3$: $2x-1=9$, $x=5$. If $x\le-2$: $-2x+1=9$, $x=-4$. If $-2\le x\le3$ the expression equals $5\ne9$. The sum is $5+(-4)=\boxed{1}$.`);

M("a10-32","amc10","nt",3,["bases"],
  R`The base-$5$ numeral $213_5$ is equal to what number in base $10$?`,
  ["48","53","58","63","68"],"58",
  [R`The places in base $5$ are $25,5,1$.`,R`$2\cdot25+1\cdot5+3\cdot1$.`,R`Add.`],
  R`$213_5=2\cdot25+1\cdot5+3=50+5+3=\boxed{58}$.`);

M("a10-33","amc10","cnt",5,["circular arrangements"],
  R`In how many ways can $6$ people sit around a round table if two particular people must sit next to each other? (Rotations of the same seating count as identical.)`,
  ["24","48","72","96","120"],"48",
  [R`Glue the two people into a block of $5$ objects around the table.`,R`Circular arrangements of $5$ objects: $(5-1)!$.`,R`The pair can swap places.`],
  R`Treat the pair as one unit, giving $5$ units around the table in $(5-1)!=24$ circular arrangements. The pair can sit in $2$ orders: $24\cdot2=\boxed{48}$.`);

M("a10-34","amc10","geo",5,["Heron's formula"],
  R`A triangle has side lengths $7$, $8$, and $9$. What is the square of its area?`,
  ["600","640","720","756","810"],"720",
  [R`Use Heron's formula. The semiperimeter is $12$.`,R`$A^2=s(s-a)(s-b)(s-c)$.`,R`$12\cdot5\cdot4\cdot3$.`],
  R`$s=12$, so $A^2=12\cdot5\cdot4\cdot3=\boxed{720}$.`,
  R`Heron's formula gives $A^2$ directly; taking a square root and squaring again wastes time.`);

M("a10-35","amc10","alg",3,["infinite series"],
  R`What is the sum of the infinite geometric series $6+2+\frac23+\frac29+\cdots$?`,
  ["8","9","10","12","18"],"9",
  [R`Find the first term and the common ratio.`,R`First term $6$, ratio $\frac13$.`,R`Sum $=\frac{a}{1-r}$.`],
  R`With $a=6$ and $r=\frac13$, the sum is $\frac{6}{1-1/3}=\frac{6}{2/3}=\boxed{9}$.`);

M("a10-36","amc10","nt",5,["gcd","Euler's totient"],
  R`How many ordered pairs $(a,b)$ of positive integers satisfy $a+b=20$ and $\gcd(a,b)=1$?`,
  ["6","8","10","12","16"],"8",
  [R`$\gcd(a,b)=\gcd(a,a+b)=\gcd(a,20)$.`,R`So you need $\gcd(a,20)=1$ with $1\le a\le19$.`,R`Count numbers up to $19$ coprime to $20=2^2\cdot5$.`],
  R`Since $\gcd(a,b)=\gcd(a,20)$, we need $a$ coprime to $20$: $a\in\{1,3,7,9,11,13,17,19\}$. There are $\boxed{8}$ pairs (this is $\varphi(20)$).`);

M("a10-37","amc10","cnt",5,["stars and bars"],
  R`How many ordered triples $(x,y,z)$ of nonnegative integers satisfy $x+y+z=10$?`,
  ["36","55","66","78","120"],"66",
  [R`This is a stars-and-bars count.`,R`$10$ stars and $2$ bars: $12$ positions.`,R`$\binom{12}{2}$.`],
  R`The count is $\binom{10+2}{2}=\binom{12}2=\boxed{66}$.`);

M("a10-38","amc10","geo",5,["tangent lines","circles"],
  R`Two circles with radii $3$ and $5$ have centers $10$ apart. What is the length of a common internal tangent segment (between the two points of tangency)?`,
  ["4","6","8",R`$4\sqrt6$`,"10"],"6",
  [R`For an internal tangent, shrink the picture: the segment's length satisfies $d^2=L^2+(r_1+r_2)^2$.`,R`$r_1+r_2=8$ and $d=10$.`,R`$L=\sqrt{100-64}$.`],
  R`Draw the radii to the tangent points; they are perpendicular to the tangent. Translating one radius gives a right triangle with hypotenuse $10$ and one leg $3+5=8$. The other leg, the tangent length, is $\sqrt{100-64}=\boxed{6}$.`,
  R`For an external tangent the leg is $|r_1-r_2|$ instead, giving $\sqrt{96}=4\sqrt6$.`);

M("a10-39","amc10","alg",4,["quadratics","vertex form"],
  R`A parabola $y=ax^2+bx+c$ has vertex $(2,-3)$ and passes through $(0,1)$. What is $y$ when $x=5$?`,
  ["3","4","6","9","12"],"6",
  [R`Write it in vertex form: $y=a(x-2)^2-3$.`,R`Plug in $(0,1)$ to find $a$.`,R`$4a-3=1$ gives $a=1$.`],
  R`$y=a(x-2)^2-3$ and $1=a\cdot4-3$ so $a=1$. At $x=5$: $y=9-3=\boxed{6}$.`);

M("a10-40","amc10","nt",4,["primes","digits"],
  R`What is the sum of all two-digit prime numbers whose digits add up to $8$?`,
  ["87","124","141","159","177"],"141",
  [R`List the two-digit numbers with digit sum $8$: $17,26,35,44,53,62,71,80$.`,R`Which of those are prime?`,R`$17,53,71$.`],
  R`The candidates are $17,26,35,44,53,62,71,80$. The primes are $17,53,71$, with sum $\boxed{141}$.`);
