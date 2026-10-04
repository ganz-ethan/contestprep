// 33 original AMC 8-style problems.
M("a8-7","amc8","nt",2,["multiples"],
  R`How many multiples of $7$ are there between $100$ and $200$, inclusive?`,
  ["12","13","14","15","16"],"14",
  [R`Find the first and last multiples of 7 in the range.`,R`$105=7\cdot15$ and $196=7\cdot28$.`,R`Count the integers from 15 to 28.`],
  R`The first multiple is $7\cdot15=105$ and the last is $7\cdot28=196$. The count is $28-15+1=\boxed{14}$.`,
  R`Subtracting $28-15=13$ forgets that both endpoints count.`);

M("a8-8","amc8","alg",1,["linear equations"],
  R`If $4(x-3)=2x+10$, what is $x$?`,
  ["7","9","11","13","17"],"11",
  [R`Distribute the 4 on the left.`,R`$4x-12=2x+10$.`,R`Collect the $x$ terms on one side.`],
  R`$4x-12=2x+10\Rightarrow 2x=22\Rightarrow x=\boxed{11}$.`);

M("a8-9","amc8","geo",3,["circles","area"],
  R`A circle is inscribed in a square of side length $8$ (it touches all four sides). What is the area of the part of the square outside the circle?`,
  [R`$64-4\pi$`,R`$64-8\pi$`,R`$64-16\pi$`,R`$256-16\pi$`,R`$64+16\pi$`],R`$64-16\pi$`,
  [R`The circle touches opposite sides, so its diameter equals the side of the square.`,R`The radius is $4$.`,R`Subtract the circle's area from the square's.`],
  R`The diameter is $8$, so the radius is $4$ and the circle has area $16\pi$. The square has area $64$. The region outside the circle is $\boxed{64-16\pi}$.`);

M("a8-10","amc8","cnt",3,["counting principle","restrictions"],
  R`Sam has $4$ shirts, $3$ pairs of pants, and $2$ hats. He refuses to wear his red shirt with his blue pants (with either hat). How many outfits can he make?`,
  ["18","20","22","23","24"],"22",
  [R`First count all outfits with no restriction.`,R`There are $4\cdot3\cdot2=24$ outfits in total.`,R`How many of those use the forbidden shirt-pants pair?`],
  R`Without restrictions there are $4\cdot3\cdot2=24$ outfits. The forbidden pair can go with either hat, so $2$ outfits are banned. The answer is $24-2=\boxed{22}$.`,
  R`Subtracting only $1$ forgets that the banned pair appears once per hat.`);

M("a8-11","amc8","alg",2,["ratios"],
  R`The ratio of boys to girls in a class of $40$ students is $3:5$. How many more girls than boys are in the class?`,
  ["5","8","10","12","15"],"10",
  [R`The ratio $3:5$ splits the class into $3+5$ equal parts.`,R`$40\div8=5$ students per part.`,R`Boys: $15$. Girls: $25$.`],
  R`There are $3+5=8$ parts, each with $5$ students. Boys: $15$; girls: $25$. The difference is $\boxed{10}$.`);

M("a8-12","amc8","nt",3,["exponents","digits"],
  R`What is the sum of the digits of $2^{10}\cdot5^{8}$?`,
  ["1","2","4","8","10"],"4",
  [R`Pair up as many $2$'s and $5$'s as you can. Each pair makes a $10$.`,R`$2^{10}\cdot5^8=2^2\cdot(2\cdot5)^8$.`,R`That is $4\cdot10^8$.`],
  R`$2^{10}\cdot5^8=2^2\cdot10^8=4\cdot10^8=400{,}000{,}000$, whose digit sum is $\boxed{4}$.`);

M("a8-13","amc8","geo",2,["angles","ratios"],
  R`The angles of a triangle are in the ratio $2:3:4$. What is the measure of its largest angle, in degrees?`,
  ["70","75","80","85","90"],"80",
  [R`Angles of a triangle add to $180^\circ$.`,R`Write the angles as $2k,3k,4k$.`,R`$9k=180$.`],
  R`$2k+3k+4k=180\Rightarrow k=20$, so the largest angle is $4k=\boxed{80}$ degrees.`);

M("a8-14","amc8","cnt",2,["handshakes","combinations"],
  R`At a party of $8$ people, everyone shakes hands exactly once with everyone else. How many handshakes occur?`,
  ["16","28","32","56","64"],"28",
  [R`Each handshake involves a pair of people.`,R`$8\cdot7$ counts each handshake twice (once per person).`,R`$\frac{8\cdot7}2$.`],
  R`Each of the $8$ people shakes hands with $7$ others, giving $8\cdot7=56$, but every handshake was counted twice. So there are $\frac{56}{2}=\boxed{28}$.`);

M("a8-15","amc8","alg",3,["rates","average speed"],
  R`A car drives $120$ miles at $60$ miles per hour, then drives back the same $120$ miles at $40$ miles per hour. What is its average speed for the whole trip, in miles per hour?`,
  ["45","48","50","52","54"],"48",
  [R`Average speed is total distance divided by total time, not the average of the two speeds.`,R`Time going: $120/60=2$ hours. Time returning: $120/40=3$ hours.`,R`$240$ miles in $5$ hours.`],
  R`Total distance is $240$ miles. Total time is $2+3=5$ hours. Average speed: $\frac{240}{5}=\boxed{48}$ mph.`,
  R`The average of $60$ and $40$ is $50$, which is wrong because more time is spent at the slower speed.`);

M("a8-16","amc8","nt",3,["squares","cubes","overlap"],
  R`How many positive integers less than $50$ are perfect squares or perfect cubes (or both)?`,
  ["8","9","10","11","12"],"9",
  [R`List the perfect squares below $50$, then the perfect cubes.`,R`Squares: $1,4,9,16,25,36,49$. Cubes: $1,8,27$.`,R`One number is on both lists.`],
  R`Squares: $7$ numbers. Cubes: $3$ numbers. The number $1$ is both. Total: $7+3-1=\boxed{9}$.`,
  R`Adding $7+3=10$ double counts $1$.`);

M("a8-17","amc8","geo",4,["right triangles","area"],
  R`A right triangle has legs $9$ and $12$. What is the length of the altitude to its hypotenuse?`,
  ["6","7.2","7.5","8","9"],"7.2",
  [R`First find the hypotenuse.`,R`It is $15$ (a 3-4-5 triangle scaled by 3).`,R`Compute the area two ways: $\frac12\cdot9\cdot12=\frac12\cdot15\cdot h$.`],
  R`The hypotenuse is $15$. The area is $\frac12\cdot9\cdot12=54$. Also area $=\frac12\cdot15\cdot h$, so $h=\frac{108}{15}=\boxed{7.2}$.`);

M("a8-18","amc8","cnt",3,["probability","without replacement"],
  R`A bag has $4$ red marbles and $6$ blue marbles. Two marbles are drawn without replacement. What is the probability that both are red?`,
  ["1/9","2/15","4/25","1/5","3/10"],"2/15",
  [R`Multiply the probability of the first red by the probability of the second red given the first.`,R`First: $\frac4{10}$. Then there are $3$ red among $9$.`,R`$\frac4{10}\cdot\frac39$.`],
  R`$\frac{4}{10}\cdot\frac{3}{9}=\frac{12}{90}=\boxed{\tfrac2{15}}$.`,
  R`Using $\frac4{10}\cdot\frac4{10}$ would be correct only with replacement.`);

M("a8-19","amc8","alg",2,["arithmetic sequences"],
  R`The first term of a sequence is $5$, and each term after that is $3$ more than the previous term. What is the $20$th term?`,
  ["57","60","62","65","68"],"62",
  [R`The 2nd term is $5+3$, the 3rd is $5+2\cdot3$. Spot the pattern.`,R`The $n$th term is $5+3(n-1)$.`,R`$5+3\cdot19$.`],
  R`The $20$th term is $5+3\cdot19=\boxed{62}$.`,
  R`There are $19$ steps between term $1$ and term $20$, not $20$.`);

M("a8-20","amc8","nt",4,["gcd","lcm"],
  R`Two positive integers have greatest common divisor $6$ and least common multiple $180$. If one of them is $36$, what is the other?`,
  ["15","20","30","45","60"],"30",
  [R`For any two positive integers, $\gcd\cdot\text{lcm}=\text{product}$.`,R`The product is $6\cdot180=1080$.`,R`Divide by $36$.`],
  R`The product of the two numbers is $6\cdot180=1080$, so the other number is $\frac{1080}{36}=\boxed{30}$. (Check: $\gcd(36,30)=6$ and $\text{lcm}=180$.)`);

M("a8-21","amc8","geo",3,["Pythagorean theorem","rectangles"],
  R`A rectangle has a diagonal of length $13$ and one side of length $5$. What is its area?`,
  ["48","56","60","65","72"],"60",
  [R`The diagonal and two sides form a right triangle.`,R`This is a $5$-$12$-$13$ triangle.`,R`The other side is $12$.`],
  R`The other side is $\sqrt{13^2-5^2}=12$. The area is $5\cdot12=\boxed{60}$.`);

M("a8-22","amc8","cnt",3,["diagonals","polygons"],
  R`How many diagonals does a convex hexagon have?`,
  ["6","8","9","12","15"],"9",
  [R`Count pairs of vertices, then remove the ones that are sides.`,R`$\binom62=15$ pairs of vertices.`,R`A hexagon has $6$ sides.`],
  R`There are $\binom62=15$ segments joining two vertices. Of these, $6$ are sides, so there are $15-6=\boxed{9}$ diagonals.`);

M("a8-23","amc8","alg",3,["percent"],
  R`A store raises the price of a jacket by $20\%$, then lowers the new price by $20\%$. Compared with the original price, the final price is:`,
  ["increased by 4%","unchanged","decreased by 2%","decreased by 4%","decreased by 5%"],"decreased by 4%",
  [R`Pick a convenient starting price, such as $100$.`,R`After the increase: $120$.`,R`$20\%$ of $120$ is $24$.`],
  R`Start with $100$. After the increase, the price is $120$. After the decrease it is $120-24=96$. This is a $\boxed{4\%}$ decrease.`,
  R`Percent changes do not cancel, because they apply to different bases.`);

M("a8-24","amc8","nt",3,["units digit","cycles"],
  R`What is the units digit of $7^{2025}$?`,
  ["1","3","5","7","9"],"7",
  [R`List the units digits of $7^1,7^2,7^3,\ldots$ and look for a cycle.`,R`$7,9,3,1,7,9,3,1,\ldots$ has period $4$.`,R`What is $2025$ modulo $4$?`],
  R`The units digits repeat $7,9,3,1$ with period $4$. Since $2025=4\cdot506+1$, the units digit matches $7^1$: $\boxed{7}$.`);

M("a8-25","amc8","geo",2,["coordinates","area"],
  R`Triangle $ABC$ has vertices $A(1,1)$, $B(7,1)$, and $C(4,5)$. What is its area?`,
  ["10","12","15","18","24"],"12",
  [R`$A$ and $B$ have the same $y$-coordinate, so $AB$ is horizontal.`,R`Base $AB=6$.`,R`The height is the vertical distance from $C$ to the line $y=1$.`],
  R`$AB=6$ is horizontal and $C$ is $5-1=4$ units above it. Area $=\frac12\cdot6\cdot4=\boxed{12}$.`);

M("a8-26","amc8","cnt",3,["lattice paths"],
  R`How many different paths go from the bottom-left corner to the top-right corner of a grid that is $3$ squares wide and $4$ squares tall, moving only right or up along grid lines?`,
  ["12","20","30","35","64"],"35",
  [R`Every path has exactly $3$ right moves and $4$ up moves.`,R`The path is determined by which of the $7$ moves are "right".`,R`$\binom73$.`],
  R`Every path has $7$ moves: $3$ right and $4$ up. Choosing which $3$ of the $7$ are right gives $\binom73=\boxed{35}$.`);

M("a8-27","amc8","alg",3,["age problems","equations"],
  R`Mia is $3$ times as old as Sam. In $6$ years, Mia will be twice as old as Sam. How old is Mia now?`,
  ["12","15","18","21","24"],"18",
  [R`Let Sam's age now be $s$. Then Mia is $3s$.`,R`In 6 years: $3s+6=2(s+6)$.`,R`Solve for $s$, then find Mia's age.`],
  R`$3s+6=2s+12\Rightarrow s=6$. Mia is $3\cdot6=\boxed{18}$.`,
  R`The question asks for Mia's age, not Sam's.`);

M("a8-28","amc8","nt",4,["divisors"],
  R`What is the smallest positive integer with exactly $6$ positive divisors?`,
  ["8","10","12","18","20"],"12",
  [R`Check small numbers, or use the divisor-count formula.`,R`A number with $6=(2+1)(1+1)$ divisors can look like $p^2q$.`,R`Try $2^2\cdot3$.`],
  R`If $n=p^2q$ then it has $(2+1)(1+1)=6$ divisors. The smallest choice is $2^2\cdot3=\boxed{12}$. Checking $1$ through $11$ confirms none of them has $6$ divisors.`);

M("a8-29","amc8","geo",3,["surface area","volume"],
  R`A cube has surface area $150$. What is its volume?`,
  ["25","100","125","150","216"],"125",
  [R`A cube has $6$ identical square faces.`,R`$6s^2=150$.`,R`$s=5$.`],
  R`$6s^2=150\Rightarrow s^2=25\Rightarrow s=5$, so the volume is $5^3=\boxed{125}$.`);

M("a8-30","amc8","cnt",4,["arrangements","gluing trick"],
  R`In how many ways can $5$ different books be placed on a shelf if two particular books must be next to each other?`,
  ["24","36","48","60","96"],"48",
  [R`Treat the two books that must be together as a single block.`,R`Now you are arranging $4$ objects.`,R`The two books can be in either order inside the block.`],
  R`Glue the two books into one block: $4!=24$ arrangements of the $4$ objects, times $2$ orders inside the block: $\boxed{48}$.`);

M("a8-31","amc8","alg",2,["consecutive integers"],
  R`The sum of five consecutive integers is $75$. What is the largest of them?`,
  ["15","16","17","18","19"],"17",
  [R`The middle number of an odd run of consecutive integers equals their average.`,R`The average is $75/5=15$.`,R`The integers are $13,14,15,16,17$.`],
  R`The middle integer is the mean, $75/5=15$, so the integers are $13,14,15,16,17$ and the largest is $\boxed{17}$.`);

M("a8-32","amc8","nt",3,["digits","casework"],
  R`How many two-digit positive integers have a tens digit equal to twice the units digit?`,
  ["3","4","5","6","9"],"4",
  [R`Let the units digit be $u$. Then the tens digit is $2u$, and it must be a single digit from $1$ to $9$.`,R`$u=0$ would give tens digit $0$, which is not a two-digit number.`,R`Try $u=1,2,3,4$.`],
  R`The tens digit $2u$ must be at most $9$, so $u\le4$, and $u\ne0$. The numbers are $21,42,63,84$, so the answer is $\boxed{4}$.`);

M("a8-33","amc8","geo",4,["clocks","angles"],
  R`What is the measure, in degrees, of the smaller angle between the hands of a clock at $3{:}40$?`,
  ["120","130","140","150","160"],"130",
  [R`The minute hand moves $6^\circ$ per minute. The hour hand moves $0.5^\circ$ per minute.`,R`Minute hand at $40\cdot6=240^\circ$ from the 12.`,R`Hour hand at $3\cdot30+40\cdot0.5=110^\circ$.`],
  R`The minute hand is at $240^\circ$ and the hour hand at $90+20=110^\circ$. The angle between them is $240-110=\boxed{130}$ degrees (already less than $180$).`,
  R`The hour hand is not exactly on the 3 at 3:40; it has moved two-thirds of the way toward the 4.`);

M("a8-34","amc8","cnt",3,["probability","coins"],
  R`Three fair coins are flipped. What is the probability of getting exactly two heads?`,
  ["1/4","3/8","1/2","5/8","3/4"],"3/8",
  [R`There are $2^3=8$ equally likely outcomes.`,R`List the outcomes with exactly two heads.`,R`HHT, HTH, THH.`],
  R`There are $8$ outcomes. Exactly $3$ have two heads (HHT, HTH, THH). The probability is $\boxed{\tfrac38}$.`);

M("a8-35","amc8","alg",3,["work problems"],
  R`Ana can paint a fence in $6$ hours. Ben can paint the same fence in $3$ hours. Working together at their usual rates, how many hours will they take?`,
  ["1.5","2","2.5","3","4.5"],"2",
  [R`Think in terms of fractions of the fence painted per hour.`,R`Ana: $\frac16$ per hour. Ben: $\frac13$ per hour.`,R`Combined rate $\frac12$ per hour.`],
  R`Together they paint $\frac16+\frac13=\frac12$ of the fence each hour, so the job takes $\boxed{2}$ hours.`);

M("a8-36","amc8","nt",3,["divisors","perfect numbers"],
  R`What is the sum of all the positive divisors of $28$?`,
  ["28","42","48","56","60"],"56",
  [R`List the divisors of $28$ in pairs.`,R`$1,2,4,7,14,28$.`,R`Add them up.`],
  R`The divisors are $1,2,4,7,14,28$ with sum $\boxed{56}$. (Since $28$ is a perfect number, the sum is exactly twice the number.)`);

M("a8-37","amc8","geo",3,["polygons","angles"],
  R`Each interior angle of a regular polygon measures $150^\circ$. How many sides does the polygon have?`,
  ["8","10","12","15","18"],"12",
  [R`Look at the exterior angle instead: interior $+$ exterior $=180^\circ$.`,R`The exterior angle is $30^\circ$.`,R`Exterior angles of any convex polygon sum to $360^\circ$.`],
  R`The exterior angle is $180-150=30^\circ$. The exterior angles sum to $360^\circ$, so there are $\frac{360}{30}=\boxed{12}$ sides.`);

M("a8-38","amc8","cnt",3,["arrangements","repeated letters"],
  R`How many distinct arrangements are there of the letters in the word LEVEL?`,
  ["15","24","30","60","120"],"30",
  [R`If all $5$ letters were different there would be $5!$ arrangements.`,R`L appears twice and E appears twice.`,R`Divide by $2!$ for each repeated letter.`],
  R`$\dfrac{5!}{2!\,2!}=\dfrac{120}{4}=\boxed{30}$.`);

M("a8-39","amc8","alg",2,["exponents"],
  R`What is the value of $\dfrac{2^{10}+2^{10}}{2^9}$?`,
  ["1","2","4","8","16"],"4",
  [R`Add the two equal terms in the numerator first.`,R`$2^{10}+2^{10}=2\cdot2^{10}=2^{11}$.`,R`$2^{11}/2^9$.`],
  R`The numerator is $2\cdot2^{10}=2^{11}$, so the expression is $2^{11-9}=2^2=\boxed{4}$.`);
