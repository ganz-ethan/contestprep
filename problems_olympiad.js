// 15 more olympiad-style proof problems (USAJMO / USAMO / USCMO / MOP training level, easier end first).
// Proofs are self-graded, so each has layered hints and a full solution sketch.
function O(id, topic, diff, tags, q, hints, sol, mistakes) {
  PROBLEMS.push({ id, track: "olympiad", topic, diff, tags, q, hints, sol, mistakes });
}

O("oly-6","ineq",6,["sum of squares","equality case"],
  R`Prove that for all real numbers $a,b,c$, $a^2+b^2+c^2\ge ab+bc+ca$, with equality exactly when $a=b=c$.`,
  [R`Try to write the difference $a^2+b^2+c^2-ab-bc-ca$ as a sum of squares.`,R`Consider $(a-b)^2+(b-c)^2+(c-a)^2$.`,R`Expand it and compare with twice the difference.`],
  R`Note that $(a-b)^2+(b-c)^2+(c-a)^2=2(a^2+b^2+c^2)-2(ab+bc+ca)$. The left side is a sum of squares, hence $\ge0$, so $a^2+b^2+c^2\ge ab+bc+ca$. Equality holds iff each square is $0$, i.e. $a=b=c$. $\blacksquare$`);

O("oly-7","nt",6,["bounding between squares"],
  R`Prove that $n^2+n+1$ is never a perfect square for a positive integer $n$.`,
  [R`Squares are rare. Find two consecutive squares that trap $n^2+n+1$.`,R`Compare with $n^2$ and with $(n+1)^2=n^2+2n+1$.`,R`For $n\ge1$, $n^2\lt n^2+n+1\lt(n+1)^2$.`],
  R`For $n\ge1$, $n^2\lt n^2+n+1$ and $n^2+n+1\lt n^2+2n+1=(n+1)^2$ because $n\gt0$. So $n^2+n+1$ lies strictly between the consecutive squares $n^2$ and $(n+1)^2$, so it cannot be a perfect square. $\blacksquare$`);

O("oly-8","comb",8,["pigeonhole","divisibility"],
  R`Prove that among any $n+1$ distinct integers chosen from $\{1,2,\ldots,2n\}$, there are two such that one divides the other.`,
  [R`Pigeonhole again. What should the $n$ "boxes" be?`,R`Write every integer as $2^k\cdot m$ with $m$ odd. There are exactly $n$ odd numbers in $\{1,\ldots,2n\}$.`,R`Put numbers with the same odd part $m$ in the same box. Two numbers in one box have the form $2^jm$ and $2^km$.`],
  R`Write each chosen number as $2^k m$ with $m$ odd. The odd part $m$ is one of the $n$ odd numbers $1,3,\ldots,2n-1$. With $n+1$ chosen numbers, two share the same odd part $m$ by pigeonhole: say $2^jm$ and $2^km$ with $j\lt k$ (they are distinct). Then $2^jm\mid2^km$. $\blacksquare$`,
  R`Remember the boxes are indexed by the odd part, not by pairs of consecutive numbers (that proves a different statement).`);

O("oly-9","geo",7,["perpendicular diagonals","Pythagoras"],
  R`In a convex quadrilateral $ABCD$ the diagonals $AC$ and $BD$ are perpendicular. Prove that $AB^2+CD^2=BC^2+DA^2$.`,
  [R`Let the diagonals meet at $P$. You get four right triangles at $P$.`,R`Express each side squared by the Pythagorean theorem using $PA,PB,PC,PD$.`,R`$AB^2=PA^2+PB^2$ and so on. Add the right pairs.`],
  R`Let $P=AC\cap BD$. Since $AC\perp BD$, triangles $PAB$, $PBC$, $PCD$, $PDA$ are right-angled at $P$. So $AB^2=PA^2+PB^2$, $CD^2=PC^2+PD^2$, $BC^2=PB^2+PC^2$, $DA^2=PD^2+PA^2$. Hence $AB^2+CD^2=PA^2+PB^2+PC^2+PD^2=BC^2+DA^2$. $\blacksquare$`);

O("oly-10","comb",7,["coloring","tilings"],
  R`Two opposite corner squares are removed from an $8\times8$ chessboard. Prove that the remaining $62$ squares cannot be tiled by $31$ dominoes (each covering two adjacent squares).`,
  [R`Think about the usual chessboard coloring.`,R`What color are two opposite corners?`,R`Each domino covers one black and one white square. Count how many of each remain.`],
  R`Color the board in the usual black/white pattern. Opposite corners have the same color (say white), so after removing them there are $30$ white and $32$ black squares. Every domino covers exactly one white and one black square, so $31$ dominoes would cover $31$ of each color. This contradicts $30\ne32$. $\blacksquare$`);

O("oly-11","ineq",7,["AM-GM","product constraint"],
  R`Let $a_1,\ldots,a_n$ be positive reals with $a_1a_2\cdots a_n=1$. Prove that $a_1+a_2+\cdots+a_n\ge n$.`,
  [R`This is AM-GM in disguise. State what AM-GM says.`,R`$\frac{a_1+\cdots+a_n}{n}\ge\sqrt[n]{a_1\cdots a_n}$.`,R`The right side equals $1$. (To prove AM-GM itself, try induction by smoothing: replace the largest and smallest by their geometric mean and $1$.)`],
  R`By AM-GM, $\frac{a_1+\cdots+a_n}{n}\ge\sqrt[n]{a_1\cdots a_n}=1$, so the sum is at least $n$. $\blacksquare$

*Self-contained route by induction on $n$:* the case $n=1$ is clear. Given $n\ge2$ positive numbers with product $1$, not all equal to $1$ (otherwise the sum is exactly $n$), pick one $a\ge1$ and one $b\le1$. Replace them by $1$ and $ab$: the product is still $1$, and $(a+b)-(1+ab)=-(a-1)(b-1)\ge0$, so the sum does not increase. Now one of the numbers is $1$ and the other $n-1$ have product $1$, so by the induction hypothesis their sum is at least $n-1$. Hence the original sum is at least $1+(n-1)=n$.`,
  R`In the smoothing step, you need one number $\ge1$ and one $\le1$; that always exists when the product is $1$.`);

O("oly-12","nt",7,["pigeonhole","residues"],
  R`Prove that among any five integers there are three whose sum is divisible by $3$.`,
  [R`Look at the residues mod $3$.`,R`Case 1: all three residues $0,1,2$ appear. Case 2: some residue appears at least three times.`,R`Why must one of those cases happen among five integers? If only two residues appear, one occurs at least $\lceil5/2\rceil=3$ times.`],
  R`Consider residues mod $3$. If some residue occurs at least $3$ times, those three integers have sum $\equiv3r\equiv0$. Otherwise each residue occurs at most twice; with five integers, all three residues $0,1,2$ must occur (two residues cover at most $4$). Pick one integer of each residue: the sum is $\equiv0+1+2=3\equiv0\pmod3$. $\blacksquare$`);

O("oly-13","comb",6,["handshake lemma","parity","double counting"],
  R`At a party, some pairs of people shake hands. Prove that the number of people who shake an odd number of hands is even.`,
  [R`Count the total of everyone's handshake counts in two ways.`,R`Each handshake adds $1$ to two people's totals, so $\sum\deg=2E$.`,R`If $k$ people have odd degree, what is the parity of the sum?`],
  R`Let $d_i$ be the number of hands person $i$ shakes. Each handshake is counted twice, so $\sum d_i=2E$ is even. The sum has the same parity as the number $k$ of odd terms. Hence $k$ is even. $\blacksquare$`);

O("oly-14","geo",6,["median","right angle","isosceles"],
  R`In triangle $ABC$, let $M$ be the midpoint of $BC$. Prove that if $AM=\frac12BC$ then $\angle BAC=90^\circ$.`,
  [R`Then $M$ is equidistant from $A$, $B$, $C$: $MA=MB=MC$.`,R`Triangles $MAB$ and $MAC$ are isosceles.`,R`Add up the base angles in triangle $ABC$.`],
  R`$MA=MB=MC=\frac12BC$. In isosceles triangle $MAB$, $\angle MAB=\angle MBA=\beta$. In isosceles $MAC$, $\angle MAC=\angle MCA=\gamma$. Angles of $ABC$: $\beta+\gamma+(\beta+\gamma)=180^\circ$, so $\beta+\gamma=90^\circ$, and $\angle BAC=\angle MAB+\angle MAC=\beta+\gamma=90^\circ$. $\blacksquare$ (This is the converse of Thales' theorem.)`);

O("oly-15","nt",7,["irrationality","unique factorization"],
  R`Prove that $\log_2 3$ is irrational.`,
  [R`Suppose $\log_2 3=\frac pq$ with positive integers $p,q$.`,R`Exponentiate: $2^{p/q}=3$, so $2^p=3^q$.`,R`One side is even, the other odd.`],
  R`Suppose $\log_23=\frac pq$ with positive integers $p,q$ (it is positive since $3\gt1$). Then $2^{p/q}=3$, so $2^p=3^q$. The left side is even (as $p\ge1$) and the right side is odd. Contradiction. $\blacksquare$`);

O("oly-16","alg",6,["induction","sums"],
  R`Prove by induction that $1^3+2^3+\cdots+n^3=\left(1+2+\cdots+n\right)^2$ for all positive integers $n$.`,
  [R`Recall $1+2+\cdots+n=\frac{n(n+1)}2$, so the claim is $\sum k^3=\frac{n^2(n+1)^2}4$.`,R`Base case $n=1$: $1=1$.`,R`Inductive step: add $(n+1)^3$ to $\frac{n^2(n+1)^2}4$ and factor.`],
  R`Using $1+\cdots+n=\frac{n(n+1)}2$, we prove $S_n=\sum_{k=1}^nk^3=\frac{n^2(n+1)^2}{4}$. For $n=1$: $1=\frac{1\cdot4}{4}$. Suppose it holds for $n$. Then $S_{n+1}=\frac{n^2(n+1)^2}{4}+(n+1)^3=\frac{(n+1)^2(n^2+4n+4)}{4}=\frac{(n+1)^2(n+2)^2}{4}$, which is the formula for $n+1$. $\blacksquare$`);

O("oly-17","comb",8,["tournaments","induction","Hamiltonian path"],
  R`In a round-robin tournament every pair of $n$ players plays exactly once and there are no draws. Prove that the players can be listed as $P_1,P_2,\ldots,P_n$ so that $P_i$ beat $P_{i+1}$ for every $i$.`,
  [R`Induct on $n$. Remove one player and list the others.`,R`Take a valid list $P_1,\ldots,P_{n-1}$ for the others and try to insert the new player $X$.`,R`If $X$ beat $P_1$, put $X$ first. If $P_{n-1}$ beat $X$, put $X$ last. Otherwise find where $X$ fits in the middle.`],
  R`Induct on $n$; $n=1,2$ are clear. For $n\ge3$ remove a player $X$ and list the rest as $P_1,\ldots,P_{n-1}$ with $P_i$ beating $P_{i+1}$. If $X$ beat $P_1$, put $X$ at the front. If $P_{n-1}$ beat $X$, put $X$ at the end. Otherwise $P_1$ beat $X$ and $X$ beat $P_{n-1}$. Let $i$ be the smallest index such that $X$ beat $P_{i+1}$ (it exists, since $X$ beat $P_{n-1}$). Then $P_i$ beat $X$: for $i=1$ this is the assumption, and for $i\gt1$ it holds because, by minimality, $X$ did not beat $P_i$. Insert $X$ between $P_i$ and $P_{i+1}$: $P_i$ beat $X$ and $X$ beat $P_{i+1}$, and every other consecutive pair is unchanged. $\blacksquare$`,
  R`The key is choosing the smallest index at which the pattern flips; any index where $X$ beats $P_{i+1}$ and $P_i$ beats $X$ works.`);

O("oly-18","alg",7,["factoring","perfect squares"],
  R`Prove that the product of four consecutive positive integers plus $1$ is always a perfect square.`,
  [R`Let the integers be $n,n+1,n+2,n+3$. Pair the outer two and the inner two.`,R`$n(n+3)=n^2+3n$ and $(n+1)(n+2)=n^2+3n+2$.`,R`With $x=n^2+3n$, the expression is $x(x+2)+1$.`],
  R`Let $x=n^2+3n$. Then $n(n+1)(n+2)(n+3)=\big(n(n+3)\big)\big((n+1)(n+2)\big)=x(x+2)$. Hence $n(n+1)(n+2)(n+3)+1=x^2+2x+1=(x+1)^2=(n^2+3n+1)^2$. $\blacksquare$`);

O("oly-19","ineq",8,["Nesbitt","Cauchy-Schwarz"],
  R`Let $a,b,c$ be positive reals. Prove that $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac32$.`,
  [R`Add $1$ to each fraction: $\frac a{b+c}+1=\frac{a+b+c}{b+c}$.`,R`The sum becomes $(a+b+c)\left(\frac1{b+c}+\frac1{c+a}+\frac1{a+b}\right)-3$.`,R`Apply AM-HM (or Cauchy-Schwarz) to the three positive numbers $b+c$, $c+a$, $a+b$, which sum to $2(a+b+c)$.`],
  R`Let $s=a+b+c$. Then $\sum\frac a{b+c}=\sum\frac{s}{b+c}-3$. By Cauchy-Schwarz (or AM-HM), $\left(\sum(b+c)\right)\left(\sum\frac1{b+c}\right)\ge9$, i.e. $2s\sum\frac1{b+c}\ge9$, so $\sum\frac s{b+c}\ge\frac92$. Therefore $\sum\frac a{b+c}\ge\frac92-3=\frac32$, with equality iff $a=b=c$. $\blacksquare$`);

O("oly-20","comb",9,["Erdős-Szekeres","pigeonhole"],
  R`Prove that any sequence of $n^2+1$ distinct real numbers contains an increasing subsequence of length $n+1$ or a decreasing subsequence of length $n+1$.`,
  [R`For each term $a_i$, record the pair $(x_i,y_i)$: the length of the longest increasing subsequence ending at $a_i$, and the longest decreasing one ending at $a_i$.`,R`Suppose all $x_i,y_i\le n$. How many possible pairs are there?`,R`Show that two different terms cannot have the same pair, using that the numbers are distinct. Compare $a_i$ and $a_j$ for $i\lt j$.`],
  R`Suppose, for contradiction, that no monotone subsequence has length $n+1$. For each $i$ let $x_i$ and $y_i$ be the lengths of the longest increasing and longest decreasing subsequences ending at $a_i$. Then $1\le x_i,y_i\le n$, so there are at most $n^2$ possible pairs $(x_i,y_i)$. But there are $n^2+1$ terms, so $(x_i,y_i)=(x_j,y_j)$ for some $i\lt j$. Since $a_i\ne a_j$: if $a_i\lt a_j$ we can extend an increasing subsequence ending at $a_i$ by $a_j$, so $x_j\gt x_i$; if $a_i\gt a_j$ then similarly $y_j\gt y_i$. Either way the pairs differ, a contradiction. $\blacksquare$`,
  R`Distinctness is essential. Without it the statement is false (a constant sequence has no strictly monotone subsequence).`);
