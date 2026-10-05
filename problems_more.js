// 26 more original problems in the style of AMC 8 / AMC 10 / AMC 12. Every answer is re-computed by brute force in verify.js.

// ---------------- AMC 8 ----------------
M("a8-40","amc8","nt",2,["digits"],
  R`How many two-digit positive integers have digits whose sum is $9$?`,
  ["7","8","9","10","11"],"9",
  [R`Let the tens digit be $t$. What must the units digit be?`,R`The units digit is $9-t$, and it must be a digit from $0$ to $9$.`,R`Try $t=1,2,\ldots,9$.`],
  R`The tens digit $t$ can be $1$ through $9$, and the units digit is then $9-t$ (always a valid digit). The numbers are $18,27,36,45,54,63,72,81,90$: $\boxed{9}$.`);
M("a8-41","amc8","alg",2,["perimeter","area"],
  R`A rectangle has perimeter $36$, and its length is twice its width. What is its area?`,
  ["48","64","72","81","96"],"72",
  [R`Call the width $w$. What is the length?`,R`The perimeter is $2(w+2w)=6w$.`,R`So $6w=36$.`],
  R`With width $w$ and length $2w$, the perimeter is $6w=36$, so $w=6$ and the length is $12$. The area is $6\cdot12=\boxed{72}$.`);
M("a8-42","amc8","cnt",3,["arrangements","repeated letters"],
  R`In how many distinct ways can the letters of the word LEVEL be arranged?`,
  ["20","24","30","60","120"],"30",
  [R`If all five letters were different there would be $5!$ arrangements.`,R`The letter L appears twice and E appears twice.`,R`Divide by the number of ways to swap identical letters.`],
  R`There are $5!=120$ orderings if the letters were distinct. Swapping the two L's or the two E's gives the same word, so divide by $2\cdot2$: $120/4=\boxed{30}$.`,
  R`Dividing by $2$ only once overcounts, since both L and E repeat.`);
M("a8-43","amc8","geo",3,["right triangles","area"],
  R`A right triangle has legs of length $9$ and $12$. What is the length of the altitude drawn to the hypotenuse?`,
  ["6","7","36/5","8","9"],"36/5",
  [R`First find the hypotenuse.`,R`The hypotenuse is $15$ and the area is $\frac12\cdot9\cdot12$.`,R`The area also equals $\frac12\cdot15\cdot h$.`],
  R`The hypotenuse is $15$ and the area is $54$. Using the hypotenuse as base, $\frac12\cdot15\cdot h=54$, so $h=\boxed{\tfrac{36}{5}}$.`);
M("a8-44","amc8","nt",3,["remainders","patterns"],
  R`What is the remainder when $7^{100}$ is divided by $5$?`,
  ["0","1","2","3","4"],"1",
  [R`$7$ and $2$ leave the same remainder when divided by $5$.`,R`List the remainders of $2,2^2,2^3,2^4,\ldots$ mod $5$.`,R`They repeat every $4$ steps.`],
  R`Since $7\equiv2\pmod 5$, we look at $2^n$: the remainders are $2,4,3,1$ and then repeat. As $100$ is a multiple of $4$, $2^{100}\equiv1$, so the answer is $\boxed{1}$.`);
M("a8-45","amc8","alg",2,["mean"],
  R`The mean of five numbers is $12$. Four of the numbers are $8$, $10$, $14$ and $15$. What is the fifth number?`,
  ["11","12","13","14","15"],"13",
  [R`The five numbers add up to $5\times12$.`,R`The total is $60$.`,R`The four known numbers add up to $47$.`],
  R`The total of the five numbers is $5\cdot12=60$. The four known numbers sum to $8+10+14+15=47$, so the fifth is $60-47=\boxed{13}$.`);

// ---------------- AMC 10 ----------------
M("a10-41","amc10","cnt",3,["digits","combinations"],
  R`How many four-digit positive integers have digits that are strictly increasing from left to right (for example $1359$)?`,
  ["84","120","126","210","252"],"126",
  [R`If the digits strictly increase, each set of four different digits gives exactly one number.`,R`Could $0$ be used? It would have to be the first digit.`,R`Choose $4$ digits from $1,2,\ldots,9$.`],
  R`A set of four different digits can be written in increasing order in exactly one way, and $0$ cannot appear (it would be the leading digit). So we choose $4$ digits from $1$ to $9$: $\binom94=\boxed{126}$.`);
M("a10-42","amc10","nt",3,["squares mod 8","odd numbers"],
  R`For how many positive integers $n<100$ is $n^2-1$ divisible by $8$?`,
  ["25","48","49","50","99"],"50",
  [R`Try a few values: $n=1,2,3,4,5$.`,R`Even $n$ give $n^2-1$ odd.`,R`For odd $n=2k+1$, $n^2-1=4k(k+1)$.`],
  R`If $n$ is even then $n^2-1$ is odd. If $n=2k+1$, then $n^2-1=4k(k+1)$, and $k(k+1)$ is even, so $8$ divides it. Thus all odd $n<100$ work: there are $\boxed{50}$ of them.`);
M("a10-43","amc10","alg",3,["absolute value"],
  R`What is the sum of all real numbers $x$ that satisfy $|x-3|=2x-1$?`,
  ["2/3","1","4/3","5/3","2"],"4/3",
  [R`Split into the cases $x\ge3$ and $x<3$.`,R`If $x\ge3$: $x-3=2x-1$. Check whether the answer is at least $3$.`,R`If $x<3$: $3-x=2x-1$. Also check that $2x-1\ge0$.`],
  R`For $x\ge3$, $x-3=2x-1$ gives $x=-2$, which is not allowed. For $x<3$, $3-x=2x-1$ gives $x=\frac43$, and then $2x-1=\frac53\ge0$ works. The only solution is $\boxed{\tfrac43}$.`,
  R`Always check solutions: $x=-2$ comes out of the algebra but fails the case.`);
M("a10-44","amc10","geo",3,["area","subtraction"],
  R`Square $ABCD$ has side length $6$. Point $M$ is the midpoint of $\overline{BC}$ and $N$ is the midpoint of $\overline{CD}$. What is the area of triangle $AMN$?`,
  ["12","27/2","15","18","20"],"27/2",
  [R`Subtract the three corner triangles from the square.`,R`Triangles $ABM$ and $ADN$ each have legs $6$ and $3$.`,R`Triangle $MCN$ has legs $3$ and $3$.`],
  R`The square has area $36$. Triangles $ABM$ and $ADN$ each have area $\frac12\cdot6\cdot3=9$, and triangle $MCN$ has area $\frac12\cdot3\cdot3=\frac92$. So $[AMN]=36-9-9-\frac92=\boxed{\tfrac{27}{2}}$.`);
M("a10-45","amc10","cnt",2,["probability","complement"],
  R`Two fair six-sided dice are rolled. What is the probability that the product of the two numbers is even?`,
  ["1/2","2/3","3/4","5/6","7/8"],"3/4",
  [R`It is easier to count when the product is odd.`,R`The product is odd only if both numbers are odd.`,R`Each die is odd with probability $\frac12$.`],
  R`The product is odd only when both dice show odd numbers: probability $\frac12\cdot\frac12=\frac14$. So the product is even with probability $1-\frac14=\boxed{\tfrac34}$.`);
M("a10-46","amc10","alg",3,["reciprocals","identities"],
  R`If $x+\dfrac1x=5$, what is $x^3+\dfrac1{x^3}$?`,
  ["100","110","115","120","125"],"110",
  [R`Cube the given equation.`,R`$\left(x+\frac1x\right)^3=x^3+\frac1{x^3}+3\left(x+\frac1x\right)$.`,R`So $x^3+\frac1{x^3}=5^3-3\cdot5$.`],
  R`Cubing gives $125=x^3+\frac1{x^3}+3\left(x+\frac1x\right)=x^3+\frac1{x^3}+15$, so $x^3+\frac1{x^3}=\boxed{110}$.`);
M("a10-47","amc10","nt",3,["divisors","sum"],
  R`What is the sum of all positive odd divisors of $72$?`,
  ["9","12","13","15","26"],"13",
  [R`Factor $72=2^3\cdot3^2$.`,R`An odd divisor cannot use the factor $2$.`,R`The odd divisors are the divisors of $9$.`],
  R`Since $72=2^3\cdot3^2$, the odd divisors are the divisors of $9$: $1,3,9$. Their sum is $\boxed{13}$.`);
M("a10-48","amc10","geo",4,["Heron","area"],
  R`What is the area of a triangle with side lengths $7$, $8$ and $9$?`,
  [R`$12\sqrt5$`,"24",R`$20\sqrt2$`,R`$18\sqrt3$`,"30"],R`$12\sqrt5$`,
  [R`Use Heron's formula.`,R`The semiperimeter is $12$.`,R`Area $=\sqrt{12\cdot5\cdot4\cdot3}$.`],
  R`The semiperimeter is $s=12$, so the area is $\sqrt{12(12-7)(12-8)(12-9)}=\sqrt{720}=\boxed{12\sqrt5}$.`);
M("a10-49","amc10","cnt",4,["subsets","no two consecutive"],
  R`How many $3$-element subsets of $\{1,2,\ldots,10\}$ contain no two consecutive integers?`,
  ["35","56","70","84","120"],"56",
  [R`Think about the gaps between chosen numbers.`,R`Shrink each gap: subtract $0,1,2$ from the three chosen numbers in order.`,R`This gives a bijection with $3$-element subsets of $\{1,\ldots,8\}$.`],
  R`If $a<b<c$ are chosen with no two consecutive, then $a<b-1<c-2$ are three distinct numbers from $1$ to $8$, and this correspondence is reversible. So the count is $\binom83=\boxed{56}$.`);
M("a10-50","amc10","alg",2,["arithmetic sequences"],
  R`In an arithmetic sequence, the fifth term is $17$ and the ninth term is $33$. What is the twentieth term?`,
  ["73","77","81","85","89"],"77",
  [R`Four steps take you from term $5$ to term $9$.`,R`The common difference is $\frac{33-17}{4}$.`,R`From term $9$ to term $20$ is $11$ more steps.`],
  R`The common difference is $\frac{33-17}{9-5}=4$. The twentieth term is $33+11\cdot4=\boxed{77}$.`);
M("a10-51","amc10","nt",3,["last digit","cycles"],
  R`What is the units digit of $3^{2025}$?`,
  ["1","3","5","7","9"],"3",
  [R`Write out the units digits of $3,3^2,3^3,3^4,3^5$.`,R`They are $3,9,7,1,3$, so the pattern has length $4$.`,R`What is $2025$ modulo $4$?`],
  R`The units digits of powers of $3$ cycle $3,9,7,1$. Since $2025\equiv1\pmod4$, the units digit of $3^{2025}$ is $\boxed{3}$.`);
M("a10-52","amc10","geo",3,["inradius","right triangles"],
  R`What is the radius of the circle inscribed in a right triangle with side lengths $5$, $12$ and $13$?`,
  ["1","2","5/2","3","4"],"2",
  [R`Area equals inradius times semiperimeter.`,R`The area is $30$ and the semiperimeter is $15$.`,R`So $r=\frac{30}{15}$.`],
  R`The area is $\frac12\cdot5\cdot12=30$ and the semiperimeter is $15$. Since area $=rs$, $r=\frac{30}{15}=\boxed{2}$.`);

// ---------------- AMC 12 ----------------
M("a12-40","amc12","alg",3,["Vieta","sum of squares"],
  R`The roots of $x^3-6x^2+11x-6=0$ are $a$, $b$ and $c$. What is $a^2+b^2+c^2$?`,
  ["12","14","16","18","20"],"14",
  [R`Use $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)$.`,R`By Vieta, $a+b+c=6$.`,R`And $ab+bc+ca=11$.`],
  R`By Vieta's formulas $a+b+c=6$ and $ab+bc+ca=11$, so $a^2+b^2+c^2=36-22=\boxed{14}$.`);
M("a12-41","amc12","cnt",4,["polygons","isosceles"],
  R`Three of the vertices of a regular $12$-gon are chosen. For how many choices is the triangle they form isosceles (counting equilateral triangles as isosceles)?`,
  ["48","52","56","60","64"],"52",
  [R`Count by the apex of the equal sides: each vertex can be the apex.`,R`For a given apex there are $5$ symmetric pairs of other vertices.`,R`Equilateral triangles have been counted three times each.`],
  R`Each of the $12$ vertices is the apex of $5$ isosceles triangles, giving $60$. An equilateral triangle was counted once for each of its $3$ vertices, and there are $4$ of them, so subtract $2\cdot4=8$: $\boxed{52}$.`,
  R`Forgetting to correct for equilateral triangles gives $60$.`);
M("a12-42","amc12","nt",4,["coprime","symmetry"],
  R`What is the sum of all positive integers less than $100$ that are relatively prime to $100$?`,
  ["1500","1900","2000","2400","4000"],"2000",
  [R`If $\gcd(n,100)=1$ then $\gcd(100-n,100)=1$.`,R`Pair $n$ with $100-n$: each pair sums to $100$.`,R`There are $\varphi(100)=40$ such numbers.`],
  R`Pairing $n$ with $100-n$ keeps the numbers coprime to $100$, and each pair sums to $100$. There are $\varphi(100)=40$ numbers, so $20$ pairs: $20\cdot100=\boxed{2000}$.`);
M("a12-43","amc12","alg",3,["absolute value","quadratics"],
  R`What is the sum of the squares of all real solutions of $x^2-5|x|+6=0$?`,
  ["13","20","26","30","36"],"26",
  [R`Note that $x^2=|x|^2$, so treat $|x|$ as the unknown.`,R`$|x|^2-5|x|+6=0$ factors.`,R`$|x|=2$ or $|x|=3$, each giving two values of $x$.`],
  R`With $u=|x|$: $u^2-5u+6=0$ gives $u=2$ or $u=3$. The solutions are $\pm2,\pm3$, and the sum of squares is $4+4+9+9=\boxed{26}$.`);
M("a12-44","amc12","geo",3,["hexagons","equilateral triangles"],
  R`Regular hexagon $ABCDEF$ has side length $2$. What is the area of triangle $ACE$?`,
  [R`$3\sqrt3$`,R`$4\sqrt3$`,"6",R`$6\sqrt3$`,"12"],R`$3\sqrt3$`,
  [R`Triangle $ACE$ is equilateral.`,R`Find $AC$ using the law of cosines in triangle $ABC$ (angle $B=120^\circ$).`,R`$AC=2\sqrt3$.`],
  R`Triangle $ACE$ is equilateral with side $AC=\sqrt{2^2+2^2-2\cdot2\cdot2\cos120^\circ}=2\sqrt3$. Its area is $\frac{\sqrt3}{4}\cdot12=\boxed{3\sqrt3}$.`);
M("a12-45","amc12","cnt",3,["permutations","probability"],
  R`A permutation of $1,2,3,4,5$ is chosen uniformly at random. What is the probability that $1$ appears before $2$ and $2$ appears before $3$?`,
  ["1/8","1/6","1/4","1/3","1/2"],"1/6",
  [R`Look only at the relative order of $1$, $2$ and $3$.`,R`All $3!=6$ relative orders are equally likely.`,R`Exactly one of them is $1,2,3$.`],
  R`The relative order of $1,2,3$ is equally likely to be any of the $3!=6$ orders, and only one of them has $1$ before $2$ before $3$. The probability is $\boxed{\tfrac16}$.`);
M("a12-46","amc12","alg",3,["telescoping"],
  R`What is $\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\dfrac1{3\cdot4}+\cdots+\dfrac1{99\cdot100}$?`,
  ["99/100","100/101","49/50","1","101/100"],"99/100",
  [R`Write $\frac1{k(k+1)}$ as a difference of two fractions.`,R`$\frac1{k(k+1)}=\frac1k-\frac1{k+1}$.`,R`Most terms cancel.`],
  R`Since $\frac1{k(k+1)}=\frac1k-\frac1{k+1}$, the sum telescopes to $1-\frac1{100}=\boxed{\tfrac{99}{100}}$.`);
M("a12-47","amc12","nt",4,["coprime factorizations","prime factorization"],
  R`How many ordered pairs $(a,b)$ of positive integers satisfy $ab=360$ and $\gcd(a,b)=1$?`,
  ["4","6","8","12","16"],"8",
  [R`Factor $360=2^3\cdot3^2\cdot5$.`,R`Coprime $a$ and $b$ cannot share a prime, so each prime's full power goes to one of them.`,R`There are $3$ primes, each assigned to $a$ or $b$.`],
  R`Since $360=2^3\cdot3^2\cdot5$ and $a,b$ share no prime, each of the three prime powers goes entirely to $a$ or to $b$, giving $2^3=\boxed{8}$ ordered pairs.`);
