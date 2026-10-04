// Problem bank. All problems are ORIGINAL, written in the style of each contest.
// Do not paste real AMC/AIME/USAMO problems here (MAA copyright) - link to them instead.
// Text fields use KaTeX: $inline$ and $$display$$. Avoid a bare "<" inside math; use \lt.
//
// type: "mc" (choices + answer letter) | "int" (AIME, answer 0-999) | "proof" (self-graded)
// diff: 1-10 (rough scale: AMC8 1-3, AMC10 3-5, AMC12 4-7, AIME 5-9, Olympiad 7-10)

const TRACKS = {
  amc8:  { name: "AMC 8",  blurb: "25 questions, 40 minutes. Middle-school contest math.", type: "mc",
           contest: { n: 25, minutes: 40, correct: 1, blank: 0, wrong: 0 } },
  amc10: { name: "AMC 10", blurb: "25 questions, 75 minutes. Grades 10 and below.", type: "mc",
           contest: { n: 25, minutes: 75, correct: 6, blank: 1.5, wrong: 0 } },
  amc12: { name: "AMC 12", blurb: "25 questions, 75 minutes. Precalculus-level contest math.", type: "mc",
           contest: { n: 25, minutes: 75, correct: 6, blank: 1.5, wrong: 0 } },
  aime:  { name: "AIME",   blurb: "15 questions, 3 hours, integer answers 0-999.", type: "int",
           contest: { n: 15, minutes: 180, correct: 1, blank: 0, wrong: 0 } },
  olympiad: { name: "Olympiad (USAJMO / USAMO / USCMO / MOP)", blurb: "Full proofs. Self-graded with hints and solution sketches.", type: "proof", contest: null },
};

const TOPICS = {
  alg: "Algebra", nt: "Number Theory", cnt: "Counting & Probability",
  geo: "Geometry", ineq: "Inequalities", comb: "Combinatorics (proof)",
};

const PROBLEMS = [
  // ---------------- AMC 8 ----------------
  {
    id: "a8-1", track: "amc8", topic: "nt", diff: 2, tags: ["lcm"],
    q: String.raw`What is the sum of the digits of the smallest positive integer that is divisible by each of $1, 2, 3, 4, 5,$ and $6$?`,
    choices: ["4", "6", "8", "10", "12"], answer: "B",
    hints: [
      String.raw`The number must be a multiple of every number from 1 to 6. What is the name for the smallest such number?`,
      String.raw`Find the least common multiple. It needs $2^2$ (for 4), a 3, and a 5.`,
      String.raw`$\text{lcm} = 4\cdot 3\cdot 5 = 60$.`
    ],
    sol: String.raw`The least common multiple needs $2^2$ (to be divisible by 4), $3$, and $5$. The factor 6 is then automatic. So the number is $4\cdot3\cdot5=60$, and its digit sum is $6+0=\boxed{6}$.`,
    mistakes: String.raw`Multiplying $1\cdot2\cdots6=720$ gives a common multiple, but not the smallest one.`
  },
  {
    id: "a8-2", track: "amc8", topic: "cnt", diff: 2, tags: ["counting principle"],
    q: String.raw`How many three-digit positive integers have three distinct digits, all of which are odd?`,
    choices: ["15", "30", "60", "120", "125"], answer: "C",
    hints: [
      String.raw`The odd digits are $1,3,5,7,9$. Fill in the hundreds, tens, and ones places one at a time.`,
      String.raw`There are 5 choices for the first digit. How many are left for the second?`,
      String.raw`$5\cdot4\cdot3$.`
    ],
    sol: String.raw`Five odd digits are available. The hundreds digit has $5$ choices, the tens digit has $4$ (distinct), and the ones digit has $3$. Total: $5\cdot4\cdot3=\boxed{60}$.`,
    mistakes: String.raw`$5^3=125$ allows repeated digits, which the problem forbids.`
  },
  {
    id: "a8-3", track: "amc8", topic: "alg", diff: 2, tags: ["averages"],
    q: String.raw`The mean of five numbers is $18$. When one of the numbers is removed, the mean of the remaining four numbers is $20$. What number was removed?`,
    choices: ["10", "12", "14", "16", "18"], answer: "A",
    hints: [
      String.raw`Mean $\times$ count $=$ sum. Find the sum before and after.`,
      String.raw`Before: $5\cdot18$. After: $4\cdot20$.`,
      String.raw`The removed number is the difference of the two sums.`
    ],
    sol: String.raw`The original sum is $5\cdot18=90$. The remaining sum is $4\cdot20=80$. The removed number is $90-80=\boxed{10}$.`,
    mistakes: String.raw`Averaging 18 and 20, or subtracting the means ($20-18$), does not work. Always go through the sums.`
  },
  {
    id: "a8-4", track: "amc8", topic: "geo", diff: 2, tags: ["perimeter", "area"],
    q: String.raw`A rectangle has perimeter $36$ and its length is twice its width. What is its area?`,
    choices: ["54", "64", "81", "72", "108"], answer: "D",
    hints: [
      String.raw`Let the width be $w$. Then the length is $2w$.`,
      String.raw`Perimeter $=2(w+2w)=6w$.`,
      String.raw`$6w=36$, so $w=6$ and the length is $12$.`
    ],
    sol: String.raw`With width $w$ and length $2w$, the perimeter is $2(w+2w)=6w=36$, so $w=6$ and the length is $12$. The area is $6\cdot12=\boxed{72}$.`,
    mistakes: String.raw`Using the semi-perimeter $18$ as if it were $w+2w$ gives $w=9$. Remember the perimeter counts both pairs of sides.`
  },
  {
    id: "a8-5", track: "amc8", topic: "cnt", diff: 3, tags: ["probability", "dice"],
    q: String.raw`Two fair six-sided dice are rolled. What is the probability that the sum of the numbers is a prime number?`,
    choices: ["1/3", "5/12", "7/18", "1/2", "4/9"], answer: "B",
    hints: [
      String.raw`The possible sums are $2$ through $12$. Which of those are prime?`,
      String.raw`Prime sums: $2,3,5,7,11$. Count how many of the $36$ outcomes give each.`,
      String.raw`Ways: $1+2+4+6+2$.`
    ],
    sol: String.raw`Sums that are prime: $2$ (1 way), $3$ (2 ways), $5$ (4 ways), $7$ (6 ways), $11$ (2 ways). That is $15$ outcomes out of $36$, and $\tfrac{15}{36}=\boxed{\tfrac5{12}}$.`,
    mistakes: String.raw`Do not treat all 11 sums as equally likely; $7$ is far more likely than $2$.`
  },
  {
    id: "a8-6", track: "amc8", topic: "nt", diff: 3, tags: ["divisors", "prime factorization"],
    q: String.raw`How many positive divisors does $360$ have?`,
    choices: ["24", "20", "18", "30", "36"], answer: "A",
    hints: [
      String.raw`Start with the prime factorization of $360$.`,
      String.raw`$360=2^3\cdot3^2\cdot5$.`,
      String.raw`A divisor picks an exponent for each prime: $0$ to $3$ for $2$, $0$ to $2$ for $3$, $0$ to $1$ for $5$.`
    ],
    sol: String.raw`Since $360=2^3\cdot3^2\cdot5^1$, the number of divisors is $(3+1)(2+1)(1+1)=\boxed{24}$.`,
    mistakes: String.raw`Forgetting the $+1$ (the exponent $0$ is allowed) is the classic slip.`
  },

  // ---------------- AMC 10 ----------------
  {
    id: "a10-1", track: "amc10", topic: "alg", diff: 3, tags: ["symmetric expressions"],
    q: String.raw`If $x+\dfrac1x=5$, what is the value of $x^2+\dfrac1{x^2}$?`,
    choices: ["21", "23", "25", "27", "29"], answer: "B",
    hints: [
      String.raw`You are not asked for $x$ itself. What happens if you square the given equation?`,
      String.raw`$\left(x+\frac1x\right)^2 = x^2 + 2 + \frac1{x^2}$.`,
      String.raw`So $x^2+\frac1{x^2} = 25-2$.`
    ],
    sol: String.raw`Squaring, $x^2+2+\frac1{x^2}=25$, so $x^2+\frac1{x^2}=\boxed{23}$. (Solving for $x$ would involve $\sqrt{21}$ and be far messier.)`,
    mistakes: String.raw`Squaring gives a middle term $2x\cdot\frac1x=2$. Forgetting to subtract it gives 25.`
  },
  {
    id: "a10-2", track: "amc10", topic: "cnt", diff: 3, tags: ["permutations with repeats"],
    q: String.raw`In how many distinct ways can the letters of the word BANANA be arranged?`,
    choices: ["720", "120", "90", "60", "30"], answer: "D",
    hints: [
      String.raw`If all 6 letters were different there would be $6!$ arrangements. What goes wrong with repeated letters?`,
      String.raw`The three A's can be swapped among themselves without changing the word, and so can the two N's.`,
      String.raw`Divide $6!$ by $3!\cdot2!$.`
    ],
    sol: String.raw`There are $6!$ orderings if the letters are treated as distinct. Swapping the three A's ($3!$ ways) or the two N's ($2!$ ways) gives the same word, so the answer is $\dfrac{6!}{3!\,2!}=\dfrac{720}{12}=\boxed{60}$.`,
    mistakes: String.raw`Forgetting to divide by the B's: $1!=1$, which is harmless, but forgetting the N's is not.`
  },
  {
    id: "a10-3", track: "amc10", topic: "geo", diff: 4, tags: ["inradius", "Heron"],
    q: String.raw`A triangle has side lengths $13$, $14$, and $15$. What is the radius of its inscribed circle?`,
    choices: ["3", "3.5", "4", "5", "6"], answer: "C",
    hints: [
      String.raw`The inradius is related to the area and the semiperimeter by $A = r\,s$.`,
      String.raw`Find the area with Heron's formula. The semiperimeter is $s=21$.`,
      String.raw`$A=\sqrt{21\cdot8\cdot7\cdot6}=84$.`
    ],
    sol: String.raw`The semiperimeter is $s=21$. By Heron, $A=\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$. Since $A=rs$, we get $r=\frac{84}{21}=\boxed{4}$.`,
    mistakes: String.raw`The 13-14-15 triangle's area (84) is worth memorizing. It also has a 12 altitude to the side 14.`
  },
  {
    id: "a10-4", track: "amc10", topic: "nt", diff: 5, tags: ["modular arithmetic", "cycles"],
    q: String.raw`What are the last two digits of $3^{2025}$? Give the two-digit number formed by those digits (as a remainder when divided by $100$).`,
    choices: ["7", "13", "29", "43", "87"], answer: "D",
    hints: [
      String.raw`Work modulo $100$ and look for a repeating cycle in the powers of $3$.`,
      String.raw`$3^{10}=59049\equiv49$, so $3^{20}\equiv49^2=2401\equiv1 \pmod{100}$.`,
      String.raw`Reduce the exponent: $2025 = 20\cdot101+5$, so the answer is $3^5 \bmod 100$.`
    ],
    sol: String.raw`Since $3^{10}=59049\equiv49\pmod{100}$, we have $3^{20}\equiv49^2=2401\equiv1$. Then $2025=20\cdot101+5$, so $3^{2025}\equiv3^5=243\equiv\boxed{43}\pmod{100}$.`,
    mistakes: String.raw`Cycles mod 100 are not always length 4. For $3$ the cycle is $20$, so check before you assume.`
  },
  {
    id: "a10-5", track: "amc10", topic: "cnt", diff: 4, tags: ["complementary counting", "probability"],
    q: String.raw`Two distinct numbers are chosen at random from $\{1,2,\ldots,10\}$. What is the probability that their product is even?`,
    choices: ["1/2", "5/9", "2/3", "3/4", "7/9"], answer: "E",
    hints: [
      String.raw`"At least one is even" is awkward to count directly. What is the opposite event?`,
      String.raw`The product is odd only when both numbers are odd. How many ways are there to pick 2 of the 5 odd numbers?`,
      String.raw`$P=1-\dfrac{\binom52}{\binom{10}{2}}$.`
    ],
    sol: String.raw`The product is odd only if both numbers are odd. There are $\binom52=10$ such pairs out of $\binom{10}{2}=45$. So $P=1-\frac{10}{45}=\boxed{\tfrac79}$.`,
    mistakes: String.raw`Complementary counting is the fast contest way. Listing even-even, even-odd, odd-even cases also works but is slower.`
  },
  {
    id: "a10-6", track: "amc10", topic: "alg", diff: 3, tags: ["Vieta"],
    q: String.raw`Let $r$ and $s$ be the roots of $x^2-6x+4=0$. What is $r^2+s^2$?`,
    choices: ["20", "24", "28", "32", "36"], answer: "C",
    hints: [
      String.raw`You do not need to find $r$ and $s$ individually. Use the sum and product of the roots.`,
      String.raw`$r+s=6$ and $rs=4$.`,
      String.raw`$r^2+s^2=(r+s)^2-2rs$.`
    ],
    sol: String.raw`By Vieta, $r+s=6$ and $rs=4$. Then $r^2+s^2=(r+s)^2-2rs=36-8=\boxed{28}$.`,
    mistakes: String.raw`Do not forget the factor $2$ on $rs$.`
  },

  // ---------------- AMC 12 ----------------
  {
    id: "a12-1", track: "amc12", topic: "alg", diff: 4, tags: ["absolute value", "Vieta"],
    q: String.raw`What is the sum of all real numbers $x$ satisfying $|x^2-5x|=6$?`,
    choices: ["5", "8", "10", "12", "15"], answer: "C",
    hints: [
      String.raw`Split into two cases: $x^2-5x=6$ and $x^2-5x=-6$.`,
      String.raw`Both are quadratics with sum of roots $5$. Check that each has real roots.`,
      String.raw`The roots are $6,-1$ and $2,3$.`
    ],
    sol: String.raw`Case 1: $x^2-5x-6=0$ gives $x=6,-1$. Case 2: $x^2-5x+6=0$ gives $x=2,3$. All four are real and distinct, so the sum is $5+5=\boxed{10}$.`,
    mistakes: String.raw`Always verify the discriminant is positive before using "sum of roots $=5$". Here both are.`
  },
  {
    id: "a12-2", track: "amc12", topic: "alg", diff: 4, tags: ["Vieta", "power sums"],
    q: String.raw`Let $a,b,c$ be the roots of $x^3-7x^2+14x-8=0$. What is $a^2+b^2+c^2$?`,
    choices: ["14", "21", "28", "35", "49"], answer: "B",
    hints: [
      String.raw`Use Vieta's formulas for a cubic.`,
      String.raw`$a+b+c=7$ and $ab+bc+ca=14$.`,
      String.raw`$a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)$.`
    ],
    sol: String.raw`$a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)=49-28=\boxed{21}$. (Check: the roots are $1,2,4$ and $1+4+16=21$.)`,
    mistakes: String.raw`Mind the signs: for $x^3-7x^2+14x-8$, the sum of roots is $+7$.`
  },
  {
    id: "a12-3", track: "amc12", topic: "geo", diff: 4, tags: ["law of cosines"],
    q: String.raw`In triangle $ABC$, $AB=7$, $AC=9$, and $\angle A=60^\circ$. What is $BC^2$?`,
    choices: ["55", "61", "63", "67", "72"], answer: "D",
    hints: [
      String.raw`You know two sides and the included angle.`,
      String.raw`Law of Cosines: $BC^2=AB^2+AC^2-2\cdot AB\cdot AC\cos A$.`,
      String.raw`$\cos60^\circ=\tfrac12$.`
    ],
    sol: String.raw`$BC^2=49+81-2\cdot7\cdot9\cdot\tfrac12=130-63=\boxed{67}$.`,
    mistakes: String.raw`Using $+2ab\cos C$ (wrong sign) gives $193$. The minus sign is for the Law of Cosines in this form.`
  },
  {
    id: "a12-4", track: "amc12", topic: "cnt", diff: 5, tags: ["recursion", "Fibonacci"],
    q: String.raw`How many subsets of $\{1,2,\ldots,10\}$ (including the empty set) contain no two consecutive integers?`,
    choices: ["89", "144", "233", "377", "1024"], answer: "B",
    hints: [
      String.raw`Let $a_n$ be the count for $\{1,\ldots,n\}$. Compute $a_1$ and $a_2$ by hand.`,
      String.raw`Case on whether $n$ is in the subset. If it is, $n-1$ is not.`,
      String.raw`$a_n=a_{n-1}+a_{n-2}$ with $a_1=2$, $a_2=3$.`
    ],
    sol: String.raw`If $n$ is not in the subset, there are $a_{n-1}$ choices. If it is, then $n-1$ is excluded and there are $a_{n-2}$ choices. So $a_n=a_{n-1}+a_{n-2}$ with $a_1=2,a_2=3$. The sequence is $2,3,5,8,13,21,34,55,89,\boxed{144}$ for $n=10$.`,
    mistakes: String.raw`Off-by-one: $a_{10}$ is the 10th term starting at $a_1=2$, not the 10th Fibonacci number $55$.`
  },
  {
    id: "a12-5", track: "amc12", topic: "alg", diff: 4, tags: ["logarithms", "change of base"],
    q: String.raw`If $\log_2 x+\log_4 x+\log_8 x=11$, what is $x$?`,
    choices: ["16", "32", "64", "128", "256"], answer: "C",
    hints: [
      String.raw`Convert every logarithm to base $2$.`,
      String.raw`$\log_4x=\tfrac12\log_2x$ and $\log_8x=\tfrac13\log_2x$.`,
      String.raw`$\left(1+\tfrac12+\tfrac13\right)\log_2x=11$.`
    ],
    sol: String.raw`Writing $L=\log_2x$, the equation becomes $L\left(1+\tfrac12+\tfrac13\right)=\tfrac{11}{6}L=11$, so $L=6$ and $x=2^6=\boxed{64}$.`,
    mistakes: String.raw`$\log_4 x=\frac{\log_2 x}{2}$, not $2\log_2x$.`
  },
  {
    id: "a12-6", track: "amc12", topic: "nt", diff: 6, tags: ["lcm", "counting pairs"],
    q: String.raw`How many ordered pairs $(a,b)$ of positive integers satisfy $\operatorname{lcm}(a,b)=60$?`,
    choices: ["27", "36", "40", "45", "60"], answer: "D",
    hints: [
      String.raw`Factor $60=2^2\cdot3\cdot5$ and treat each prime separately.`,
      String.raw`For a prime $p$ with exponent $e$ in $60$, you need $\max(i,j)=e$ where $i,j$ are the exponents in $a,b$. How many pairs $(i,j)$ work?`,
      String.raw`For exponent $e$ there are $2e+1$ pairs.`
    ],
    sol: String.raw`The condition is independent for each prime. For $p^e$, the pairs $(i,j)$ with $0\le i,j\le e$ and $\max(i,j)=e$ number $2e+1$. For $2^2$: $5$; for $3^1$: $3$; for $5^1$: $3$. Total: $5\cdot3\cdot3=\boxed{45}$.`,
    mistakes: String.raw`Divisor-pair counting by hand is error-prone. The prime-by-prime product is both faster and safer.`
  },

  // ---------------- AIME ----------------
  {
    id: "aime-1", track: "aime", topic: "cnt", diff: 5, tags: ["inclusion-exclusion"],
    q: String.raw`Find the number of positive integers $n\le1000$ that are divisible by exactly one of $6$, $10$, and $15$.`,
    answer: 233,
    hints: [
      String.raw`Inclusion-exclusion. Look at how the three sets overlap: what is $\operatorname{lcm}(6,10)$? $\operatorname{lcm}(6,15)$? $\operatorname{lcm}(10,15)$?`,
      String.raw`All three pairwise lcms equal $30$, and so does the triple lcm. So a number divisible by two of them is divisible by all three.`,
      String.raw`Answer $=|A\cup B\cup C|-\#\{\text{multiples of }30\}$.`
    ],
    sol: String.raw`Every pairwise lcm is $30$, so anything divisible by two of them is a multiple of $30$ (hence divisible by all three). Thus "exactly one" $=|A\cup B\cup C|-\lfloor1000/30\rfloor$. By inclusion-exclusion, $|A\cup B\cup C|=166+100+66-3\cdot33+33=266$. Subtracting the $33$ multiples of $30$: $266-33=\boxed{233}$.`,
    mistakes: String.raw`Plain inclusion-exclusion gives numbers divisible by at least one. The problem wants exactly one.`
  },
  {
    id: "aime-2", track: "aime", topic: "nt", diff: 6, tags: ["CRT", "Euler"],
    q: String.raw`Find the remainder when $2^{2025}$ is divided by $1000$.`,
    answer: 432,
    hints: [
      String.raw`$1000=8\cdot125$ with $\gcd(8,125)=1$. Find the remainder mod each, then combine with CRT.`,
      String.raw`Mod $8$: $2^{2025}\equiv0$. Mod $125$: $\varphi(125)=100$, so $2^{2025}\equiv2^{25}$.`,
      String.raw`$2^{10}=1024\equiv24$, $2^{20}\equiv576\equiv76$, $2^{25}\equiv76\cdot32=2432\equiv57\pmod{125}$. Now find $x\equiv57\pmod{125}$ with $8\mid x$.`
    ],
    sol: String.raw`Mod $8$: $2^{2025}\equiv0$. Mod $125$: by Euler, $2^{100}\equiv1$, so $2^{2025}\equiv2^{25}\equiv57$. Write $x=57+125k$; we need $x\equiv0\pmod8$. Since $57\equiv1$ and $125\equiv5\pmod 8$, we need $1+5k\equiv0$, so $k\equiv3\pmod8$. Then $x=57+375=\boxed{432}$.`,
    mistakes: String.raw`Check your answer in both moduli: $432=8\cdot54$ and $432-375=57$.`
  },
  {
    id: "aime-3", track: "aime", topic: "cnt", diff: 6, tags: ["Catalan", "lattice paths"],
    q: String.raw`A path starts at $(0,0)$ and takes $12$ steps, each one unit right or one unit up, ending at $(6,6)$. It never goes strictly above the line $y=x$. How many such paths are there?`,
    answer: 132,
    hints: [
      String.raw`Total paths without the restriction: $\binom{12}{6}=924$. Count the bad ones (those touching $y=x+1$) with a reflection.`,
      String.raw`Reflect the portion of a bad path after its first touch of $y=x+1$ across that line. Bad paths correspond to paths from $(0,0)$ to $(5,7)$.`,
      String.raw`$\binom{12}{6}-\binom{12}{5}$.`
    ],
    sol: String.raw`Bad paths touch the line $y=x+1$. Reflecting the part after the first touch gives a bijection with all paths from $(0,0)$ to $(5,7)$, of which there are $\binom{12}{5}=792$. So the answer is $924-792=\boxed{132}$, the Catalan number $C_6$.`,
    mistakes: String.raw`The reflection is across $y=x+1$, not $y=x$ (the forbidden line is the first row above the diagonal).`
  },
  {
    id: "aime-4", track: "aime", topic: "geo", diff: 6, tags: ["circumradius", "Heron"],
    q: String.raw`A triangle has side lengths $13$, $14$, $15$. If $R$ is the radius of its circumscribed circle, find $8R$.`,
    answer: 65,
    hints: [
      String.raw`A formula connects $R$ with the side lengths and the area: $R=\dfrac{abc}{4K}$.`,
      String.raw`The area is $K=84$ (Heron with $s=21$).`,
      String.raw`$R=\dfrac{13\cdot14\cdot15}{4\cdot84}=\dfrac{2730}{336}=\dfrac{65}{8}$.`
    ],
    sol: String.raw`With $K=84$, $R=\dfrac{abc}{4K}=\dfrac{2730}{336}=\dfrac{65}{8}$, so $8R=\boxed{65}$. (Asking for $8R$ makes the answer an integer, which AIME requires.)`,
    mistakes: String.raw`On the AIME the answer must be an integer from 0 to 999. If you get a fraction, the problem usually asks for a clean combination of it.`
  },
  {
    id: "aime-5", track: "aime", topic: "nt", diff: 5, tags: ["Simon's Favorite Factoring trick", "divisors"],
    q: String.raw`Find the number of ordered pairs $(x,y)$ of positive integers satisfying $\dfrac1x+\dfrac1y=\dfrac1{12}$.`,
    answer: 15,
    hints: [
      String.raw`Clear denominators: $12y+12x=xy$.`,
      String.raw`Rearrange to $(x-12)(y-12)=144$ (Simon's Favorite Factoring Trick).`,
      String.raw`Both $x-12$ and $y-12$ must be positive. Why? Count the positive divisors of $144=2^4\cdot3^2$.`
    ],
    sol: String.raw`Rearranging, $xy-12x-12y=0$, so $(x-12)(y-12)=144$. If both factors were negative, each would lie in $(-12,0)$, and their product is at most $11^2=121\lt144$, so both are positive. The number of positive divisors of $144=2^4\cdot3^2$ is $5\cdot3=\boxed{15}$.`,
    mistakes: String.raw`The negative-factor case is easy to forget. Rule it out explicitly.`
  },

  // ---------------- OLYMPIAD (proof) ----------------
  {
    id: "oly-1", track: "olympiad", topic: "nt", diff: 7, tags: ["divisibility", "factoring"],
    q: String.raw`Prove that $n^5-n$ is divisible by $30$ for every positive integer $n$.`,
    hints: [
      String.raw`$30=2\cdot3\cdot5$, and these are pairwise coprime. It suffices to show divisibility by each.`,
      String.raw`Factor: $n^5-n=n(n-1)(n+1)(n^2+1)$.`,
      String.raw`Divisibility by 2 and 3: among $n-1,n,n+1$ there is an even number and a multiple of 3. For 5: check $n\equiv0,\pm1$ (done by the first factors) and $n\equiv\pm2$ (then $n^2+1\equiv5\equiv0$).`
    ],
    sol: String.raw`Factor $n^5-n=(n-1)\,n\,(n+1)(n^2+1)$.

**2 and 3.** Among three consecutive integers $n-1,n,n+1$ one is even and one is a multiple of 3.

**5.** If $n\equiv0,1,4\pmod5$, then $n$, $n-1$, or $n+1$ is divisible by $5$. If $n\equiv2$ or $3$, then $n^2\equiv4$ and $n^2+1\equiv0\pmod5$.

Since $2,3,5$ are pairwise coprime, $30\mid n^5-n$. $\blacksquare$ (Alternative: Fermat's little theorem for $p=2,3,5$.)`,
    mistakes: String.raw`Proving divisibility by 2, 3, and 5 separately only works because they are pairwise coprime. Say so in your proof.`
  },
  {
    id: "oly-2", track: "olympiad", topic: "comb", diff: 7, tags: ["pigeonhole", "geometry"],
    q: String.raw`Five points are placed in a closed unit square. Prove that two of them are at distance at most $\dfrac{\sqrt2}2$ from each other.`,
    hints: [
      String.raw`This is a pigeonhole problem. What should the "holes" be?`,
      String.raw`Cut the square into smaller pieces so that five points must put two in one piece.`,
      String.raw`Four $\tfrac12\times\tfrac12$ squares. What is the largest distance between two points in one of them?`
    ],
    sol: String.raw`Divide the unit square into four congruent squares of side $\tfrac12$ (allowing boundaries to belong to more than one; assign boundary points arbitrarily). By pigeonhole, two of the five points lie in the same small square. Two points in a square of side $\tfrac12$ are at distance at most its diagonal, $\tfrac12\sqrt2=\tfrac{\sqrt2}2$. $\blacksquare$`,
    mistakes: String.raw`Be careful with points on the dividing lines. Closed squares may share boundary points, so assign each point to just one square.`
  },
  {
    id: "oly-3", track: "olympiad", topic: "ineq", diff: 7, tags: ["AM-GM", "Cauchy-Schwarz"],
    q: String.raw`Let $a,b,c$ be positive reals. Prove that $$(a+b+c)\left(\frac1a+\frac1b+\frac1c\right)\ge9,$$ with equality exactly when $a=b=c$.`,
    hints: [
      String.raw`Two classical tools apply directly: AM-GM or Cauchy-Schwarz.`,
      String.raw`AM-GM on each factor separately: $a+b+c\ge3\sqrt[3]{abc}$ and $\frac1a+\frac1b+\frac1c\ge\frac3{\sqrt[3]{abc}}$.`,
      String.raw`Multiply the two inequalities (all terms are positive, so this is allowed). Equality needs $a=b=c$ in each.`
    ],
    sol: String.raw`By AM-GM, $a+b+c\ge3\sqrt[3]{abc}$ and $\frac1a+\frac1b+\frac1c\ge3\sqrt[3]{\frac1{abc}}$. Both sides are positive, so multiplying gives $\ge9\sqrt[3]{abc}\cdot\frac1{\sqrt[3]{abc}}=9$. Equality in AM-GM holds iff $a=b=c$. $\blacksquare$

(Cauchy-Schwarz: $(\sum a)(\sum\frac1a)\ge(\sum\sqrt a\cdot\frac1{\sqrt a})^2=9$.)`,
    mistakes: String.raw`Do not forget the equality condition. Olympiad graders deduct for omitting it when the problem asks for it.`
  },
  {
    id: "oly-4", track: "olympiad", topic: "nt", diff: 8, tags: ["infinitude of primes", "modular arithmetic"],
    q: String.raw`Prove that there are infinitely many primes congruent to $3$ modulo $4$.`,
    hints: [
      String.raw`Mimic Euclid's proof of infinitely many primes. Assume finitely many, $p_1,\ldots,p_k$, and build a contradiction.`,
      String.raw`Consider $N=4p_1p_2\cdots p_k-1$ (include the prime $3$ in the list). What is $N$ modulo 4?`,
      String.raw`$N\equiv3\pmod4$ is odd. If every prime factor of $N$ were $\equiv1\pmod 4$, what would $N$ be mod 4? So some prime factor is $\equiv3\pmod 4$. Why is it not among the $p_i$?`
    ],
    sol: String.raw`Suppose the primes $\equiv3\pmod4$ are exactly $p_1=3,p_2,\ldots,p_k$. Let $N=4p_1\cdots p_k-1$. Then $N\equiv3\pmod4$, so $N$ is odd. If all prime factors of $N$ were $\equiv1\pmod4$, so would be $N$ (the product of numbers $\equiv1$ is $\equiv1$), a contradiction. So $N$ has a prime factor $q\equiv3\pmod4$. By assumption $q=p_i$ for some $i$, but then $q\mid4p_1\cdots p_k$ and $q\mid N$ give $q\mid1$, which is absurd. $\blacksquare$`,
    mistakes: String.raw`Using $N=p_1\cdots p_k+ 2$ or $+4$ does not control the residue mod 4 the same way. The $-1$ with a factor of $4$ is the key.`
  },
  {
    id: "oly-5", track: "olympiad", topic: "comb", diff: 8, tags: ["Ramsey", "graph theory", "pigeonhole"],
    q: String.raw`Prove that among any $6$ people at a party, there are $3$ who all know each other or $3$ who are all strangers to each other. (Acquaintance is mutual.)`,
    hints: [
      String.raw`Model this as a graph: people are vertices, and edges are colored red (know each other) or blue (strangers). You want a monochromatic triangle.`,
      String.raw`Fix one person, $P$. $P$ has $5$ other people connected by red or blue edges. What does pigeonhole say?`,
      String.raw`At least $3$ of those edges have the same color, say red, going to $A,B,C$. Look at the edges among $A,B,C$.`
    ],
    sol: String.raw`Fix a person $P$. Among the $5$ others, by pigeonhole at least $3$ are acquaintances of $P$ or at least $3$ are strangers to $P$. Suppose (the other case is symmetric) $A,B,C$ all know $P$.

If any two of $A,B,C$ know each other, say $A$ and $B$, then $P,A,B$ are three mutual acquaintances. Otherwise $A,B,C$ are pairwise strangers. Either way we get the desired triple. $\blacksquare$

(The number 6 is sharp: a pentagon/pentagram coloring of $K_5$ avoids monochromatic triangles. That is $R(3,3)=6$.)`,
    mistakes: String.raw`Say clearly why the "strangers" case is symmetric (swap the roles of "know" and "don't know").`
  },
];

// ---- helper for multiple-choice problems: the answer letter is derived from the answer text,
// so choices can never get out of sync with the key.
const R = String.raw;
function M(id, track, topic, diff, tags, q, choices, ans, hints, sol, mistakes) {
  const i = choices.indexOf(ans);
  if (i < 0) console.error("Answer not in choices:", id, ans);
  PROBLEMS.push({ id, track, topic, diff, tags, q, choices, answer: "ABCDE"[i], hints, sol, mistakes });
}
