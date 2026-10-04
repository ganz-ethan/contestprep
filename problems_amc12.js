// 33 original AMC 12-style problems.
M("a12-7","amc12","alg",3,["complex numbers","modulus"],
  R`What is $\left|(3+4i)(1-i)\right|^2$?`,
  ["25","45","50","70","100"],"50",
  [R`The modulus is multiplicative: $|zw|=|z||w|$.`,R`$|3+4i|=5$ and $|1-i|=\sqrt2$.`,R`Square the product.`],
  R`$|(3+4i)(1-i)|^2=|3+4i|^2\cdot|1-i|^2=25\cdot2=\boxed{50}$.`);

M("a12-8","amc12","alg",4,["sums","telescoping"],
  R`What is $\displaystyle\sum_{k=1}^{20}k(k+1)$?`,
  ["2870","3080","3220","3465","4200"],"3080",
  [R`Split $k(k+1)=k^2+k$.`,R`$\sum k^2=\frac{20\cdot21\cdot41}{6}=2870$ and $\sum k=210$.`,R`Or use $\sum k(k+1)=\frac{n(n+1)(n+2)}3$.`],
  R`$\sum k^2+\sum k=2870+210=\boxed{3080}$. Check: $\frac{20\cdot21\cdot22}{3}=3080$.`,
  R`The value $2870$ is only $\sum k^2$.`);

M("a12-9","amc12","alg",4,["trigonometry","double angle"],
  R`If $\sin\theta+\cos\theta=\frac12$, what is $\sin2\theta$?`,
  ["-3/4","-1/2","0","1/2","3/4"],"-3/4",
  [R`Square both sides of the given equation.`,R`$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta$.`,R`$2\sin\theta\cos\theta=\sin2\theta$.`],
  R`$\frac14=1+\sin2\theta$, so $\sin2\theta=\boxed{-\tfrac34}$.`);

M("a12-10","amc12","cnt",4,["stars and bars","at least one"],
  R`In how many ways can $10$ identical candies be distributed among $4$ children so that each child gets at least one candy?`,
  ["56","70","84","120","286"],"84",
  [R`Give each child one candy first.`,R`Distribute the remaining $6$ with no restriction.`,R`$\binom{6+3}{3}$.`],
  R`Give each child $1$ candy, leaving $6$ to distribute freely among $4$ children: $\binom{9}{3}=\boxed{84}$.`);

M("a12-11","amc12","nt",4,["modular arithmetic","cycles"],
  R`What is the remainder when $2^{2025}$ is divided by $7$?`,
  ["1","2","3","4","6"],"1",
  [R`Look for the cycle of powers of $2$ modulo $7$.`,R`$2^3=8\equiv1\pmod7$.`,R`Is $2025$ a multiple of $3$?`],
  R`Since $2^3\equiv1\pmod7$ and $3\mid2025$, $2^{2025}\equiv1$. The remainder is $\boxed{1}$.`);

M("a12-12","amc12","geo",5,["circumradius","Heron"],
  R`A triangle has sides $9$, $10$, and $17$. What is the radius of its circumscribed circle?`,
  ["17/2","9","85/8","11","12"],"85/8",
  [R`Find the area first. The semiperimeter is $18$.`,R`$A=\sqrt{18\cdot9\cdot8\cdot1}=36$.`,R`$R=\frac{abc}{4A}$.`],
  R`$s=18$, so $A=\sqrt{18\cdot9\cdot8\cdot1}=36$. Then $R=\frac{9\cdot10\cdot17}{4\cdot36}=\frac{1530}{144}=\boxed{\tfrac{85}{8}}$.`);

M("a12-13","amc12","alg",4,["logarithms","domain"],
  R`What is the solution of $\log_{10}x+\log_{10}(x-3)=1$?`,
  ["2","3","5","6","10"],"5",
  [R`Combine the logs: $\log_{10}[x(x-3)]=1$.`,R`$x(x-3)=10$, so $x^2-3x-10=0$.`,R`Roots are $5$ and $-2$. Which is in the domain?`],
  R`$x(x-3)=10$ gives $x=5$ or $x=-2$. The logs need $x>3$, so only $x=\boxed{5}$ works.`,
  R`Always check the domain of logarithms after solving.`);

M("a12-14","amc12","cnt",6,["probability","recursion"],
  R`A fair coin is flipped $10$ times. What is the probability that no two consecutive flips are both heads?`,
  ["1/8","9/64","5/32","3/16","1/4"],"9/64",
  [R`Count sequences of length $10$ over $\{H,T\}$ with no $HH$.`,R`The counts follow the Fibonacci recursion: $2,3,5,8,\ldots$.`,R`The count for $n=10$ is $144$, out of $2^{10}=1024$.`],
  R`Let $a_n$ count good sequences. $a_1=2$, $a_2=3$, and $a_n=a_{n-1}+a_{n-2}$ (if the last flip is T, any good sequence of length $n-1$; if H, the previous is T). So $a_{10}=144$ and the probability is $\frac{144}{1024}=\boxed{\tfrac9{64}}$.`);

M("a12-15","amc12","geo",5,["sphere","inscribed cube"],
  R`A cube is inscribed in a sphere of radius $3$ (all eight vertices lie on the sphere). What is the volume of the cube?`,
  [R`$8\sqrt3$`,R`$12\sqrt3$`,R`$24\sqrt3$`,R`$36\sqrt3$`,R`$54$`],R`$24\sqrt3$`,
  [R`The space diagonal of the cube is a diameter of the sphere.`,R`A cube of side $s$ has space diagonal $s\sqrt3$.`,R`$s\sqrt3=6$.`],
  R`The space diagonal equals the diameter $6$, so $s=\frac6{\sqrt3}=2\sqrt3$. The volume is $s^3=8\cdot3\sqrt3=\boxed{24\sqrt3}$.`);

M("a12-16","amc12","alg",5,["polynomial remainder"],
  R`A polynomial $P(x)$ leaves remainder $5$ when divided by $x-1$ and remainder $7$ when divided by $x-2$. When $P(x)$ is divided by $(x-1)(x-2)$ the remainder is $R(x)$. What is $R(10)$?`,
  ["17","20","23","25","28"],"23",
  [R`The remainder on dividing by a quadratic has degree at most $1$: $R(x)=ax+b$.`,R`By the remainder theorem, $P(1)=5$ and $P(2)=7$, and $R$ agrees with $P$ at $1$ and $2$.`,R`$a+b=5$ and $2a+b=7$.`],
  R`Write $P(x)=(x-1)(x-2)Q(x)+ax+b$. Then $a+b=P(1)=5$ and $2a+b=P(2)=7$, so $a=2$, $b=3$. $R(10)=2\cdot10+3=\boxed{23}$.`);

M("a12-17","amc12","nt",5,["sum of divisors"],
  R`What is the sum of all positive divisors of $360$?`,
  ["1080","1170","1215","1260","1320"],"1170",
  [R`Factor: $360=2^3\cdot3^2\cdot5$.`,R`The divisor-sum function is multiplicative.`,R`$(1+2+4+8)(1+3+9)(1+5)$.`],
  R`$\sigma(360)=(1+2+4+8)(1+3+9)(1+5)=15\cdot13\cdot6=\boxed{1170}$.`);

M("a12-18","amc12","cnt",5,["derangements","inclusion-exclusion"],
  R`How many permutations of $\{1,2,3,4,5\}$ have no fixed point (that is, no $i$ is in position $i$)?`,
  ["36","44","53","60","76"],"44",
  [R`Use inclusion-exclusion on the set of permutations fixing position $i$.`,R`$D_5=5!-\binom51 4!+\binom52 3!-\binom53 2!+\binom54 1!-\binom55 0!$.`,R`$120-120+60-20+5-1$.`],
  R`$D_5=120-120+60-20+5-1=\boxed{44}$. (Recursion check: $D_n=(n-1)(D_{n-1}+D_{n-2})$ gives $D_5=4(9+2)=44$.)`);

M("a12-19","amc12","geo",4,["isosceles","inradius"],
  R`An isosceles triangle has two sides of length $10$ and a base of length $12$. What is the radius of its inscribed circle?`,
  ["3","3.5","4","4.8","6"],"3",
  [R`Drop the altitude to the base to find the height.`,R`The altitude is $\sqrt{100-36}=8$, so the area is $48$.`,R`$r=\frac{A}{s}$ with $s=16$.`],
  R`The altitude to the base is $8$, so the area is $\frac12\cdot12\cdot8=48$. The semiperimeter is $16$. $r=\frac{48}{16}=\boxed{3}$.`);

M("a12-20","amc12","alg",6,["power sums","Vieta"],
  R`Let $r$ and $s$ be the roots of $x^2-4x+1=0$. What is $r^4+s^4$?`,
  ["142","178","194","206","242"],"194",
  [R`You know $r+s=4$ and $rs=1$.`,R`$r^2+s^2=(r+s)^2-2rs=14$.`,R`$r^4+s^4=(r^2+s^2)^2-2(rs)^2$.`],
  R`$r^2+s^2=16-2=14$. Then $r^4+s^4=14^2-2\cdot1^2=\boxed{194}$.`);

M("a12-21","amc12","nt",5,["units digit"],
  R`What is the units digit of $1^1+2^2+3^3+\cdots+10^{10}$?`,
  ["3","5","7","8","9"],"7",
  [R`Find the units digit of each term separately.`,R`$1,4,7,6,5,6,3,6,9,0$.`,R`Add them: $47$.`],
  R`Units digits: $1^1\to1$, $2^2\to4$, $3^3=27\to7$, $4^4=256\to6$, $5^5\to5$, $6^6\to6$, $7^7\to3$, $8^8\to6$, $9^9\to9$, $10^{10}\to0$. Sum $=47$, so the units digit is $\boxed{7}$.`);

M("a12-22","amc12","cnt",5,["dice","probability"],
  R`Three fair six-sided dice are rolled. What is the probability that their sum is $10$?`,
  ["1/12","1/9","1/8","5/36","1/6"],"1/8",
  [R`There are $6^3=216$ outcomes. Count those with sum $10$.`,R`Count by the smallest die or use the generating function $(x+\cdots+x^6)^3$.`,R`There are $27$ ordered triples.`],
  R`The ordered triples with sum $10$ number $27$ (partitions $6{+}3{+}1$, $6{+}2{+}2$, $5{+}4{+}1$, $5{+}3{+}2$, $4{+}4{+}2$, $4{+}3{+}3$ contribute $6+3+6+6+3+3=27$). So $P=\frac{27}{216}=\boxed{\tfrac18}$.`);

M("a12-23","amc12","geo",5,["distance from point to line"],
  R`What is the distance from the point $(1,2)$ to the line $3x+4y=24$?`,
  ["11/5","12/5","13/5","14/5","3"],"13/5",
  [R`Use the point-to-line distance formula after moving everything to one side.`,R`The line is $3x+4y-24=0$.`,R`$\frac{|3\cdot1+4\cdot2-24|}{\sqrt{3^2+4^2}}$.`],
  R`$d=\dfrac{|3+8-24|}{5}=\boxed{\tfrac{13}5}$.`);

M("a12-24","amc12","alg",5,["functional equations"],
  R`A function $f$ satisfies $f(x)+2f\!\left(\tfrac1x\right)=x$ for all $x\ne0$. What is $f(2)$?`,
  ["-2/3","-1/3","0","1/3","2/3"],"-1/3",
  [R`Substitute $x=2$ and $x=\frac12$ to get two equations.`,R`$f(2)+2f(\tfrac12)=2$ and $f(\tfrac12)+2f(2)=\tfrac12$.`,R`Eliminate $f(\tfrac12)$.`],
  R`From the two equations, $f(\tfrac12)=\tfrac12-2f(2)$. Substituting: $f(2)+1-4f(2)=2$, so $-3f(2)=1$ and $f(2)=\boxed{-\tfrac13}$.`);

M("a12-25","amc12","nt",6,["linear Diophantine"],
  R`How many ordered pairs $(x,y)$ of positive integers satisfy $3x+5y=100$?`,
  ["5","6","7","8","9"],"6",
  [R`Reduce modulo $3$ to find which $y$ work.`,R`$5y\equiv100\pmod3$ means $2y\equiv1$, so $y\equiv2\pmod3$.`,R`$y\in\{2,5,8,11,14,17\}$; check that $x$ stays positive.`],
  R`We need $100-5y$ divisible by $3$ and positive. That forces $y\equiv2\pmod3$ and $y\le19$: $y=2,5,8,11,14,17$. Each gives a positive integer $x$. The answer is $\boxed{6}$.`);

M("a12-26","amc12","cnt",5,["non-adjacent selections"],
  R`In how many ways can $3$ chairs be chosen from a row of $10$ chairs so that no two chosen chairs are adjacent?`,
  ["35","56","84","120","165"],"56",
  [R`Place the $7$ unchosen chairs first. The chosen chairs go into gaps.`,R`There are $8$ gaps (including the two ends), and at most one chosen chair per gap.`,R`$\binom83$.`],
  R`The $7$ unchosen chairs create $8$ gaps; choosing $3$ distinct gaps gives $\binom83=\boxed{56}$.`);

M("a12-27","amc12","geo",6,["Brahmagupta","cyclic quadrilateral"],
  R`A cyclic quadrilateral has side lengths $1,2,3,4$ (in some order around the circle). What is the square of its area?`,
  ["20","24","30","36","48"],"24",
  [R`Brahmagupta's formula: $K=\sqrt{(s-a)(s-b)(s-c)(s-d)}$.`,R`The semiperimeter is $5$.`,R`$(4)(3)(2)(1)$.`],
  R`$s=5$, so $K^2=(5-1)(5-2)(5-3)(5-4)=4\cdot3\cdot2\cdot1=\boxed{24}$. (The area is the same for any order, as long as the quadrilateral is cyclic.)`);

M("a12-28","amc12","alg",5,["roots","IVT"],
  R`How many real roots does $x^3-3x+1=0$ have?`,
  ["0","1","2","3","4"],"3",
  [R`Evaluate the polynomial at a few points and look for sign changes.`,R`$f(-2)=-1$, $f(0)=1$, $f(1)=-1$, $f(2)=3$.`,R`Sign changes on $(-2,0)$, $(0,1)$, and $(1,2)$.`],
  R`Let $f(x)=x^3-3x+1$. Then $f(-2)=-1\lt0\lt f(0)=1$, $f(1)=-1\lt0$, and $f(2)=3\gt0$. By the Intermediate Value Theorem there is a root in each of $(-2,0)$, $(0,1)$, $(1,2)$. A cubic has at most $3$ roots, so the answer is $\boxed{3}$.`);

M("a12-29","amc12","nt",6,["divisor counting","factorials"],
  R`How many positive divisors does $12!$ have?`,
  ["396","576","792","864","1152"],"792",
  [R`Find the prime factorization of $12!$ using Legendre's formula.`,R`$12!=2^{10}\cdot3^5\cdot5^2\cdot7\cdot11$.`,R`Multiply $(e+1)$ over the exponents.`],
  R`The exponent of $2$ is $6+3+1=10$; of $3$: $4+1=5$; of $5$: $2$; of $7$ and $11$: $1$. The number of divisors is $11\cdot6\cdot3\cdot2\cdot2=\boxed{792}$.`);

M("a12-30","amc12","cnt",4,["recursion","words"],
  R`How many $5$-letter words can be made from the letters $A,B,C$ if no two adjacent letters are equal?`,
  ["48","54","81","96","243"],"48",
  [R`Choose the letters one at a time from left to right.`,R`The first letter has $3$ choices.`,R`Each later letter must differ from the one before it: $2$ choices.`],
  R`The first letter has $3$ choices and each of the next four has $2$: $3\cdot2^4=\boxed{48}$.`);

M("a12-31","amc12","geo",5,["angle bisector theorem"],
  R`In triangle $ABC$, $AB=6$, $AC=9$, and $BC=10$. The bisector of angle $A$ meets $BC$ at $D$. What is $BD$?`,
  ["3","4","5","6","7"],"4",
  [R`Angle bisector theorem: $\frac{BD}{DC}=\frac{AB}{AC}$.`,R`$\frac{BD}{DC}=\frac69=\frac23$.`,R`$BD+DC=10$.`],
  R`$BD:DC=6:9=2:3$ and $BD+DC=10$, so $BD=\frac25\cdot10=\boxed{4}$.`);

M("a12-32","amc12","alg",5,["series"],
  R`What is $\displaystyle\sum_{n=1}^{\infty}\frac{n}{2^n}$?`,
  ["1","3/2","2","3","4"],"2",
  [R`Let $S$ be the sum. Compare $S$ and $\frac S2$.`,R`$S-\frac S2=\frac12+\frac14+\frac18+\cdots$.`,R`The right side is a geometric series with sum $1$.`],
  R`$S=\frac12+\frac24+\frac38+\cdots$ and $\frac S2=\frac14+\frac28+\cdots$. Subtracting: $\frac S2=\frac12+\frac14+\frac18+\cdots=1$, so $S=\boxed{2}$.`);

M("a12-33","amc12","nt",5,["quadratic residues","CRT"],
  R`How many integers $x$ with $0\le x\lt15$ satisfy $x^2\equiv1\pmod{15}$?`,
  ["2","3","4","5","8"],"4",
  [R`$15=3\cdot5$. Solve modulo $3$ and modulo $5$ separately.`,R`Mod $3$: $x\equiv\pm1$. Mod $5$: $x\equiv\pm1$.`,R`The Chinese Remainder Theorem combines each pair of choices.`],
  R`$x^2\equiv1$ mod $3$ gives $x\equiv\pm1$ and mod $5$ gives $x\equiv\pm1$. By CRT there are $2\cdot2=4$ solutions: $1,4,11,14$. The answer is $\boxed{4}$.`);

M("a12-34","amc12","cnt",5,["probability","cube"],
  R`Two distinct vertices of a cube are chosen at random. What is the probability that they are joined by an edge?`,
  ["1/4","2/7","3/7","1/2","4/7"],"3/7",
  [R`Count pairs of vertices.`,R`$\binom82=28$ pairs; the cube has $12$ edges.`,R`$\frac{12}{28}$.`],
  R`There are $\binom82=28$ pairs of vertices and $12$ edges, so $P=\frac{12}{28}=\boxed{\tfrac37}$.`);

M("a12-35","amc12","geo",6,["regular tetrahedron","volume"],
  R`What is the volume of a regular tetrahedron with edge length $6$?`,
  [R`$9\sqrt2$`,R`$18\sqrt2$`,R`$24$`,R`$36$`,R`$54\sqrt2$`],R`$18\sqrt2$`,
  [R`The volume of a regular tetrahedron with edge $a$ is $\frac{a^3}{6\sqrt2}$.`,R`Or find the base area $9\sqrt3$ and the height $2\sqrt6$ and use $\frac13Bh$.`,R`$\frac{216}{6\sqrt2}=\frac{36}{\sqrt2}$.`],
  R`The base is an equilateral triangle of area $9\sqrt3$. Its centroid is $2\sqrt3$ from a vertex, so the height is $\sqrt{36-12}=2\sqrt6$. $V=\frac13\cdot9\sqrt3\cdot2\sqrt6=6\sqrt{18}=\boxed{18\sqrt2}$.`);

M("a12-36","amc12","alg",6,["Lucas numbers","recurrences"],
  R`Let $a$ and $b$ be the roots of $x^2-x-1=0$. What is $a^{10}+b^{10}$?`,
  ["89","110","123","144","199"],"123",
  [R`Let $L_n=a^n+b^n$. Since $a^2=a+1$ and $b^2=b+1$, find a recurrence for $L_n$.`,R`$L_n=L_{n-1}+L_{n-2}$ with $L_1=1$, $L_2=3$.`,R`Compute up to $L_{10}$.`],
  R`$L_n=L_{n-1}+L_{n-2}$ with $L_1=a+b=1$ and $L_2=(a+b)^2-2ab=3$. The terms are $1,3,4,7,11,18,29,47,76,\boxed{123}$.`);

M("a12-37","amc12","nt",6,["divisibility","residues"],
  R`How many integers $n$ with $1\le n\le100$ have the property that $n(n+1)$ is divisible by $6$?`,
  ["33","50","66","67","75"],"66",
  [R`$n(n+1)$ is always even, so you only need divisibility by $3$.`,R`$3\mid n(n+1)$ means $n\equiv0$ or $2\pmod3$.`,R`Count such $n$ up to $100$.`],
  R`The product of consecutive integers is always even, so we need $3\mid n(n+1)$, i.e., $n\equiv0$ or $2\pmod3$. There are $33$ values with $n\equiv0$ ($3,6,\ldots,99$) and $33$ with $n\equiv2$ ($2,5,\ldots,98$). Total $\boxed{66}$.`);

M("a12-38","amc12","cnt",5,["complementary counting","arrangements"],
  R`Eight people stand in a row. In how many ways can they be arranged so that two particular people are NOT next to each other?`,
  ["20160","30240","35280","40320","50400"],"30240",
  [R`Count all arrangements, then subtract the ones where the two are adjacent.`,R`Adjacent arrangements: glue them into a block, $7!\cdot2$.`,R`$8!-2\cdot7!$.`],
  R`Total: $8!=40320$. Arrangements with the two together: $2\cdot7!=10080$. The answer is $40320-10080=\boxed{30240}$.`);

M("a12-39","amc12","geo",7,["inscribed triangle","maximum area"],
  R`What is the maximum possible area of a triangle inscribed in a circle of radius $1$?`,
  [R`$\frac{\sqrt3}{2}$`,R`$1$`,R`$\frac{3\sqrt3}{4}$`,R`$\frac32$`,R`$\sqrt3$`],R`$\frac{3\sqrt3}{4}$`,
  [R`Guess a nice candidate: the equilateral triangle is the usual extremal shape.`,R`Area of a triangle with circumradius $R$ is $\frac12R^2(\sin2A+\sin2B+\sin2C)$.`,R`Check: equilateral triangle of side $\sqrt3$.`],
  R`With $R=1$, area $=\frac12(\sin2A+\sin2B+\sin2C)$, which is maximized when $A=B=C=60^\circ$ (by concavity of $\sin$ on the relevant range / Jensen). Then the triangle is equilateral with side $\sqrt3$ and area $\frac{\sqrt3}{4}\cdot3=\boxed{\tfrac{3\sqrt3}4}$.`,
  R`Fixing the circumradius, the equilateral triangle gives the largest area. A right isosceles triangle gives only $1$.`);
