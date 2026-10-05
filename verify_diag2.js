// Run: node verify_diag2.js [--quick]
// INDEPENDENT re-derivation of every diagnostic answer. For each of the 283 skills, a checker parses the numbers back out
// of the QUESTION TEXT only and recomputes the answer by a different route than the generator used (brute force, numeric
// root-finding, a different formula, exact big-integer arithmetic). All 19,500 items are checked (--quick: every 5th).
// A skill with no checker is a failure, so coverage cannot silently slip when skills are added.
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
const D = ctx.window.DIAG, quick = process.argv.includes("--quick");

// ---------- helpers ----------
const nums = s => (s.replace(/(?<=[\d)}A-Za-z])-(?=\d)/g, " - ").match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a), lcm = (a, b) => a / gcd(a, b) * b;
const divisors = n => { const d = []; for (let i = 1; i * i <= n; i++) if (n % i === 0) { d.push(i); if (i * i !== n) d.push(n / i); } return d; };
const nDiv = n => divisors(n).length;
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const factorial = n => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };
const binom = (n, k) => { if (k < 0 || k > n) return 0n; return factorial(n) / (factorial(k) * factorial(n - k)); };
const powmod = (b, e, m) => { let r = 1n % BigInt(m); const B = BigInt(b) % BigInt(m); for (let i = 0n; i < BigInt(e); i++) r = r * B % BigInt(m); return Number(r); };
const SIDES = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6 };
const shapeOf = q => SIDES[(q.match(/(triangle|square|rectangle|pentagon|hexagon)s?/) || [])[1]];
const frac = (a, b) => a / b;
const heron = (a, b, c) => { const s = (a + b + c) / 2; return Math.sqrt(s * (s - a) * (s - b) * (s - c)); };
const sum = xs => xs.reduce((a, b) => a + b, 0);
const mean = xs => sum(xs) / xs.length;
// complex helpers + Durand-Kerner for cubic roots
const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], cs = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cd = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
function roots3(c2, c1, c0) { const f = z => { const z2 = cm(z, z), z3 = cm(z2, z); return [z3[0] + c2 * z2[0] + c1 * z[0] + c0, z3[1] + c2 * z2[1] + c1 * z[1]]; };
  const r = [[1, 0], [0.4, 0.9], [-0.65, 0.72]]; for (let it = 0; it < 800; it++) for (let i = 0; i < 3; i++) { let den = [1, 0]; for (let j = 0; j < 3; j++) if (j !== i) den = cm(den, cs(r[i], r[j])); r[i] = cs(r[i], cd(f(r[i]), den)); } return r; }
const cpow = (z, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cm(r, z); return r; };
function cubic(q) { const m = q.match(/(x\^3[^=]*)=0/); const e = m[1].replace(/(\d)x/g, "$1*x").replace(/([+-])x/g, "$11*x").replace(/x\^(\d)/g, "x**$1").replace(/^x/, "1*x"); const f = new Function("x", "return " + e); return { c0: f(0), c2: (f(1) + f(-1)) / 2 - f(0), c1: (f(1) - f(-1)) / 2 - 1 }; }
const powerSum = (q, n) => { const { c2, c1, c0 } = cubic(q); return roots3(c2, c1, c0).reduce((s, z) => s + cpow(z, n)[0], 0); };
// number of binary strings of length n avoiding patterns (brute force for small n)
const avoidBrute = (n, pats) => { let c = 0; for (let m = 0; m < 1 << n; m++) { const s = m.toString(2).padStart(n, "0"); if (!pats.some(p => s.includes(p))) c++; } return c; };

const CK = {}; const ck = (L, name, fn) => { CK[L + "|" + name] = fn; };

// ================= LEVEL 100 =================
ck(100,"Add within 20",(q,N)=>N[0]+N[1]); ck(100,"Subtract within 20",(q,N)=>N[0]-N[1]); ck(100,"Add a story",(q,N)=>N[0]+N[1]); ck(100,"Take away a story",(q,N)=>N[0]-N[1]);
ck(100,"Doubles",(q,N)=>2*N[0]); ck(100,"Add ten",(q,N)=>N[0]+10); ck(100,"Missing addend",(q,N)=>N[1]-N[0]); ck(100,"Add three numbers",(q,N)=>sum(N));
ck(100,"Fact family",(q,N)=>N[0]-N[1]); ck(100,"Balance the equation",(q,N)=>N[0]+N[1]-N[2]); ck(100,"Add three (story)",(q,N)=>sum(N));
ck(100,"Compare lengths",(q,N)=>N[0]-N[1]); ck(100,"Longer object",(q,N)=>N[0]-N[1]); ck(100,"Sides of drawn shapes",(q,N)=>N[0]*shapeOf(q)); ck(100,"Two objects end to end",(q,N)=>N[0]+N[1]);
ck(100,"Count sides",(q,N)=>N[0]*shapeOf(q)); ck(100,"Corners of shapes",(q,N)=>N[0]*shapeOf(q)); ck(100,"How many more",(q,N)=>N[0]-N[1]); ck(100,"Count in all",(q,N)=>sum(N));
ck(100,"How many fewer",(q,N)=>N[0]-N[1]); ck(100,"Two groups altogether",(q,N)=>N[0]+N[1]); ck(100,"Red and blue",(q,N)=>N[0]+N[1]);
ck(100,"What comes after",(q,N)=>N[0]+1); ck(100,"What comes before",(q,N)=>N[0]-1); ck(100,"Ten more or ten less",(q,N)=>/more/.test(q)?N[1]+10:N[1]-10);
ck(100,"Count back",(q,N)=>N[3]-(N[0]-N[1])); ck(100,"Tens and ones",(q,N)=>10*N[0]+N[1]);
ck(100,"Count evens",(q,N)=>{let c=0;for(let i=1;i<=N[1];i++)if(i%2===0)c++;return c;}); ck(100,"Odd numbers up to",(q,N)=>{let c=0;for(let i=1;i<=N[1];i++)if(i%2===1)c++;return c;});
ck(100,"Skip counting",(q,N)=>N[3]+(N[1]-N[0]));
// ================= LEVEL 200 =================
ck(200,"Add two-digit numbers",(q,N)=>N[0]+N[1]); ck(200,"Subtract two-digit numbers",(q,N)=>N[0]-N[1]); ck(200,"Missing addend (two-digit)",(q,N)=>N[1]-N[0]); ck(200,"Missing addend (story)",(q,N)=>N[1]-N[0]);
ck(200,"Groups of items",(q,N)=>N[0]*N[1]); ck(200,"Equal groups",(q,N)=>N[0]*N[1]); ck(200,"Fact family (two-digit)",(q,N)=>N[0]-N[1]);
ck(200,"Perimeter of a rectangle",(q,N)=>2*(N[0]+N[1])); ck(200,"Perimeter of a square",(q,N)=>4*N[0]); ck(200,"Perimeter of a triangle",(q,N)=>sum(N)); ck(200,"Perimeter story",(q,N)=>2*(N[0]+N[1]));
const twoShapes=(q,N)=>{const m=q.match(/on (\d+) (\w+?)s and (\d+) (\w+?)s/);return +m[1]*SIDES[m[2]]+ +m[3]*SIDES[m[4]];}; ck(200,"Sides of two shapes",twoShapes); ck(200,"Total sides",twoShapes);
ck(200,"How many are not",(q,N)=>N[1]+N[2]); ck(200,"Compare data",(q,N)=>Math.max(...N)-Math.min(...N));
ck(200,"Place value",(q,N)=>{const s=String(N[0]),i=s.indexOf(String(N[1]));return N[1]*10**(s.length-1-i);}); ck(200,"10 more, 100 less",(q,N)=>/more/.test(q)?N[1]+10:N[1]-100);
// ================= LEVEL 300 =================
ck(300,"Multiplication facts",(q,N)=>N[0]*N[1]); ck(300,"Division facts",(q,N)=>N[0]/N[1]); ck(300,"Fraction of a number",(q,N)=>N[2]/N[1]); ck(300,"Groups story (multiply)",(q,N)=>N[0]*N[1]);
ck(300,"Share equally (divide)",(q,N)=>N[0]/N[1]); ck(300,"Fraction of a set (story)",(q,N)=>N[0]/N[2]); ck(300,"Doubling a number",(q,N)=>2*N[0]); ck(300,"Half of an even number",(q,N)=>N[0]/2);
ck(300,"Missing factor",(q,N)=>N[1]/N[0]); ck(300,"Multi-step word problem",(q,N)=>N[0]*N[1]+N[2]); ck(300,"How many groups",(q,N)=>N[0]/N[1]); ck(300,"Cost of items",(q,N)=>N[0]*N[1]);
ck(300,"Change from a bill",(q,N)=>N[0]-N[1]*N[2]); ck(300,"Area of a rectangle",(q,N)=>N[0]*N[1]); ck(300,"Missing side from area",(q,N)=>N[0]/N[1]); ck(300,"Area story",(q,N)=>N[0]*N[1]);
ck(300,"L-shaped area",(q,N)=>N[0]*N[1]+N[2]*N[3]); ck(300,"Perimeter from sides",(q,N)=>2*(N[0]+N[1])); ck(300,"Perimeter from area (square)",(q,N)=>4*Math.round(Math.sqrt(N[0]))); ck(300,"Area of a square",(q,N)=>N[0]*N[0]);
ck(300,"Pairs of clothes",(q,N)=>N[0]*N[1]); ck(300,"Coin flip sequences",(q,N)=>{let c=1;for(let i=0;i<N[0];i++)c*=2;return c;}); ck(300,"Three choices",(q,N)=>N[0]*N[1]*N[2]); ck(300,"Menu combinations",(q,N)=>N[0]*N[1]*N[2]);
ck(300,"Short codes",(q,N)=>N[1]**N[0]); ck(300,"Games in a tournament",(q,N)=>{let c=0;for(let i=0;i<N[0];i++)for(let j=i+1;j<N[0];j++)c++;return c;}); ck(300,"Outfits",(q,N)=>N[0]*N[1]);
ck(300,"Next multiple",(q,N)=>{let x=N[1]+1;while(x%N[0])x++;return x;}); ck(300,"Count multiples",(q,N)=>{let c=0;for(let i=1;i<=N[2];i++)if(i%N[0]===0)c++;return c;}); /* N = [k,1,n] */
// ================= LEVEL 400 =================
ck(400,"Three-digit by one-digit",(q,N)=>N[0]*N[1]); ck(400,"Two-digit by two-digit",(q,N)=>N[0]*N[1]); ck(400,"Add fractions, like denominators",(q,N)=>(N[0]+N[2])/N[1]);
ck(400,"Round to the nearest ten",(q,N)=>Math.floor((N[0]+5)/10)*10); ck(400,"Subtract three-digit numbers",(q,N)=>N[0]-N[1]); ck(400,"Divide with no remainder",(q,N)=>N[0]/N[1]);
ck(400,"Solve a one-step-plus equation",(q,N)=>(N[2]-N[1])/N[0]); ck(400,"Pattern rule",(q,N)=>N[0]*N[2]+N[1]); ck(400,"Find the unknown (story)",(q,N)=>(N[2]-N[1])/N[0]); ck(400,"Perimeter equation",(q,N)=>N[0]/2-N[1]);
ck(400,"Angles on a line / in a triangle",(q,N)=>/straight line/.test(q)?180-N[0]:180-N[0]-N[1]); ck(400,"Area from perimeter",(q,N)=>(N[0]/2-N[1])*N[1]); ck(400,"Rectangle area and perimeter",(q,N)=>N[0]*N[1]-2*(N[0]+N[1]));
ck(400,"Angles around a point",(q,N)=>360-N[0]-N[1]); ck(400,"Right angles in a figure",(q,N)=>4*N[0]);
ck(400,"Simple probability",(q,N)=>N[0]/(N[0]+N[1]+N[2])); ck(400,"Probability of not red",(q,N)=>(N[1]+N[2])/(N[0]+N[1]+N[2])); ck(400,"Spinner probability",(q,N)=>N[1]/N[0]);
ck(400,"Marble draws (count)",(q,N)=>N[0]*N[1]); ck(400,"Seating arrangements",(q,N)=>{let p=1;for(let i=1;i<=N[0];i++)p*=i;return p;});
ck(400,"Numbers from digits",(q,N)=>{let p=1;for(let i=0;i<N[2];i++)p*=N[1]-i;return p;}); ck(400,"Digits with repeats",(q,N)=>N[2]**N[0]);
ck(400,"Greatest common factor",(q,N)=>{for(let g=Math.min(N[0],N[1]);g>=1;g--)if(N[0]%g===0&&N[1]%g===0)return g;}); ck(400,"Least common multiple",(q,N)=>{for(let m=Math.max(N[0],N[1]);;m++)if(m%N[0]===0&&m%N[1]===0)return m;});
ck(400,"Multiples in a range",(q,N)=>{let c=0;for(let i=N[1];i<=N[2];i++)if(i%N[0]===0)c++;return c;}); ck(400,"Is it prime? (count primes)",(q,N)=>{let c=0;for(let i=N[0];i<=N[1];i++)if(isPrime(i))c++;return c;}); ck(400,"Count the factors",(q,N)=>nDiv(N[0]));
// ================= LEVEL 500 =================
ck(500,"Add unlike fractions",(q,N)=>N[0]/N[1]+N[2]/N[3]); ck(500,"Multiply decimals",(q,N)=>N[0]*N[1]); ck(500,"Order of operations",(q,N)=>N[0]+N[1]*N[2]-N[3]/N[4]);
ck(500,"Add decimals",(q,N)=>N[0]+N[1]); ck(500,"Subtract decimals",(q,N)=>N[0]-N[1]); ck(500,"Fraction times whole number",(q,N)=>N[0]/N[1]*N[2]);
ck(500,"Evaluate an expression",(q,N)=>N[0]*N[4]*N[4]+N[2]*N[4]-N[3]); ck(500,"Two-step equation",(q,N)=>N[0]*(N[1]+N[2])); ck(500,"Evaluate with two variables",(q,N)=>N[0]*N[2]+N[1]*N[3]);
ck(500,"Solve x + a = b",(q,N)=>N[1]-N[0]); ck(500,"Solve ax = b",(q,N)=>N[1]/N[0]);
ck(500,"Area of a triangle",(q,N)=>N[0]*N[1]/2); ck(500,"Volume of a box",(q,N)=>N[0]*N[1]*N[2]); ck(500,"Perimeter of composite",(q,N)=>2*(N[0]+N[1])); ck(500,"Volume of a cube",(q,N)=>N[0]**3);
ck(500,"Mean",(q,N)=>mean(N)); ck(500,"Median of five",(q,N)=>[...N].sort((a,b)=>a-b)[2]); ck(500,"Range of data",(q,N)=>Math.max(...N)-Math.min(...N)); ck(500,"Mean from a total",(q,N)=>N[0]/N[1]);
ck(500,"Arrangements (factorial)",(q,N)=>Number(factorial(N[0]))); ck(500,"Arrangements of some items",(q,N)=>Number(factorial(N[0])/factorial(N[0]-N[1])));
ck(500,"Probability with a die",(q,N)=>{const n=N[0];let c=0;for(let i=1;i<=n;i++){const m=q.match(/multiple of (\d+)/),l=q.match(/less than (\d+)/),g=q.match(/greater than (\d+)/);if(m?i%+m[1]===0:l?i<+l[1]:g?i>+g[1]:isPrime(i))c++;}return c/n;});
ck(500,"Least common multiple (larger)",(q,N)=>lcm(N[0],N[1])); ck(500,"Sum of prime factors",(q,N)=>{let s=0;for(let p=2;p<=N[0];p++)if(N[0]%p===0&&isPrime(p))s+=p;return s;});
ck(500,"Count primes",(q,N)=>{let c=0;for(let i=N[0];i<=N[1];i++)if(isPrime(i))c++;return c;}); ck(500,"Factors in common",(q,N)=>{let c=0;for(let i=1;i<=N[0];i++)if(N[0]%i===0&&N[1]%i===0)c++;return c;});
ck(500,"Is it divisible?",(q,N)=>{let c=0;for(let i=N[0];i<=N[1];i++)if(i%N[2]===0)c++;return c;});
// ================= LEVEL 600 =================
ck(600,"Percent of a number",(q,N)=>N[0]*N[1]/100); ck(600,"Ratio and total",(q,N)=>Math.max(N[0],N[1])*N[2]/(N[0]+N[1])); ck(600,"Divide fractions",(q,N)=>(N[0]/N[1])/(N[2]/N[3]));
ck(600,"Integer arithmetic",(q,N)=>N[0]*N[1]+N[2]-N[3]); // N = [-a, b, c, -d]
ck(600,"Solve a(x-b)=c",(q,N)=>N[2]/N[0]+N[1]); ck(600,"Proportion",(q,N)=>N[0]*N[1]/N[2]);
ck(600,"Area of a trapezoid",(q,N)=>(N[0]+N[1])*N[2]/2); ck(600,"Angle ratios in a triangle",(q,N)=>{const [a,b,c]=N,k=180/(a+b+c);return /largest/.test(q)?Math.max(a,b,c)*k:Math.min(a,b,c)*k;});
ck(600,"Circumference",(q,N)=>/diameter/.test(q)?N[0]:2*N[0]); ck(600,"Area of a parallelogram",(q,N)=>N[0]*N[1]); ck(600,"Complementary angles",(q,N)=>90-N[0]);
ck(600,"Median (even count)",(q,N)=>{const s=[...N].sort((a,b)=>a-b);return (s[2]+s[3])/2;}); ck(600,"Missing value for a mean",(q,N)=>5*N[4]-sum(N.slice(0,4))); ck(600,"Probability of one of two colors",(q,N)=>(N[0]+N[1])/(N[0]+N[1]+N[2])); ck(600,"Mean of a list",(q,N)=>mean(N));
ck(600,"Two dice",(q,N)=>{const m=N[0],s=N[3],mode=(q.match(/is (exactly|at least|at most)/)||[])[1];let c=0;for(let a=1;a<=m;a++)for(let b=1;b<=m;b++){const v=a+b;if(mode==="exactly"?v===s:mode==="at least"?v>=s:v<=s)c++;}return c/(m*m);});
ck(600,"Number of divisors",(q,N)=>nDiv(N[0])); ck(600,"LCM of three numbers",(q,N)=>lcm(lcm(N[0],N[1]),N[2])); ck(600,"Largest prime factor",(q,N)=>{let b=1;for(let p=2;p<=N[0];p++)if(N[0]%p===0&&isPrime(p))b=p;return b;});
ck(600,"Even divisors",(q,N)=>divisors(N[0]).filter(d=>d%2===0).length);
// ================= LEVEL 700 =================
ck(700,"Percent change twice",(q,N)=>N[0]*(1+N[1]/100)*(1-N[2]/100)); ck(700,"Unit rate",(q,N)=>N[1]/N[0]*N[2]); ck(700,"Simple interest",(q,N)=>N[0]*(N[1]/100)*N[2]);
ck(700,"Variables on both sides",(q,N)=>{const m=q.match(/\$(\d+)x([+-]\d+)?=(\d+)x([+-]\d+)?\$/);const a=+m[1],b=+(m[2]||0),c=+m[3],d=+(m[4]||0);return (d-b)/(a-c);});
ck(700,"Counting inequality solutions",(q,N)=>{let c=0;for(let x=1;N[0]*x+N[1]<N[2];x++)c++;return c;});
ck(700,"Area of a circle",(q,N)=>/diameter/.test(q)?(N[0]/2)**2:N[0]**2); ck(700,"Right triangle leg",(q,N)=>Math.sqrt(N[0]*N[0]-N[1]*N[1])); ck(700,"Polygon angle sum",(q,N)=>(N[0]-2)*180);
ck(700,"Surface area of a box",(q,N)=>2*(N[0]*N[1]+N[1]*N[2]+N[0]*N[2]));
ck(700,"Triangle angle with algebra",(q,N)=>{const m=q.match(/\$(\d*)x\^\\circ\$, \$\((\d*)x\+10\)\^\\circ\$, and \$(\d+)\^\\circ\$/);const a=m[1]===""?1:+m[1],b=m[2]===""?1:+m[2];return (170-+m[3])/(a+b);});
ck(700,"Independent events",(q,N)=>N[0]/N[1]*N[2]/N[3]); ck(700,"Handshakes",(q,N)=>{let c=0;for(let i=0;i<N[0];i++)c+=i;return c;}); ck(700,"Committee of two",(q,N)=>Number(binom(N[1],2)));
ck(700,"At least one success",(q)=>{const m=q.match(/probability \$\\frac\{(\d+)\}\{(\d+)\}\$\. In (\d+) trials/);return 1-(1-m[1]/m[2])**m[3];});
ck(700,"Product is a multiple",(q,N)=>{const n=N[0],m=N[3];let c=0;for(let a=1;a<=n;a++)for(let b=1;b<=n;b++)if(a*b%m===0)c++;return c/(n*n);});
ck(700,"Divisors from factorization",(q,N)=>(N[1]+1)*(N[3]+1)); ck(700,"GCD of larger numbers",(q,N)=>gcd(N[0],N[1])); ck(700,"Prime factors with multiplicity",(q,N)=>{let n=N[0],c=0;for(let p=2;n>1;p++)while(n%p===0){n/=p;c++;}return c;});
ck(700,"Divisible by a but not b",(q,N)=>{let c=0;for(let i=1;i<=N[1];i++)if(i%N[2]===0&&i%N[3]!==0)c++;return c;});
ck(700,"Smallest number with remainders",(q)=>{const m=q.match(/remainder (\d+) when divided by (\d+) and remainder (\d+) when divided by (\d+)/);for(let x=1;;x++)if(x%+m[2]===+m[1]&&x%+m[4]===+m[3])return x;});
// ================= LEVEL 800 =================
ck(800,"Laws of exponents",(q,N)=>N[0]**(N[1]+N[3]-N[5])); ck(800,"Square roots",(q,N)=>Math.sqrt(N[0])+Math.sqrt(N[1])-Math.sqrt(N[2])); ck(800,"Scientific notation",(q,N)=>N[0]*N[3]*10**(N[2]+N[5])); // N = [a,10,m,b,10,n]
ck(800,"System of equations",(q,N)=>(N[0]+N[1])/2);
const pts=q=>[...q.matchAll(/\((-?\d+),(-?\d+)\)/g)].map(m=>[+m[1],+m[2]]);
ck(800,"Slope",(q)=>{const [[a,b],[c,d]]=pts(q);return (d-b)/(c-a);}); ck(800,"y-intercept",(q)=>{const [[a,b],[c,d]]=pts(q);const m=(d-b)/(c-a);return b-m*a;});
ck(800,"Distance squared",(q)=>{const [[a,b],[c,d]]=pts(q);return (c-a)**2+(d-b)**2;}); ck(800,"Cylinder volume",(q,N)=>N[0]*N[0]*N[1]); ck(800,"Hypotenuse",(q,N)=>Math.sqrt(N[0]**2+N[1]**2)); ck(800,"Diagonal of a rectangle",(q,N)=>Math.sqrt(N[0]**2+N[1]**2)); ck(800,"Ladder against a wall",(q,N)=>Math.sqrt(N[0]**2-N[1]**2));
ck(800,"Choose a committee",(q,N)=>Number(binom(N[1],N[0]))); ck(800,"With replacement",(q,N)=>{const k=/^Two/.test(q.slice(q.indexOf("blue marbles. ")+14))?2:3;return (N[0]/(N[0]+N[1]))**k;});
ck(800,"Without replacement",(q,N)=>N[0]*(N[0]-1)/((N[0]+N[1])*(N[0]+N[1]-1))); ck(800,"Strings without repeats",(q,N)=>Number(factorial(N[1])/factorial(N[1]-N[0])));
ck(800,"Permutations of some items",(q,N)=>{const k=/fourth-place/.test(q)?4:/bronze/.test(q)?3:2;return Number(factorial(N[0])/factorial(N[0]-k));});
ck(800,"License plates",(q,N)=>{const rep=/may repeat/.test(q);let v=1;for(let i=0;i<N[0];i++)v*=rep?26:26-i;for(let i=0;i<N[1];i++)v*=rep?10:10-i;return v;});
ck(800,"Units digit of a power",(q,N)=>powmod(N[0],N[1],10)); ck(800,"Remainder of a power",(q,N)=>powmod(N[0],N[1],N[2])); ck(800,"Divisible by a or b",(q,N)=>{let c=0;for(let i=1;i<=N[1];i++)if(i%N[2]===0||i%N[3]===0)c++;return c;});
// ================= LEVEL 900 =================
ck(900,"Dilution",(q,N)=>N[0]*(N[1]/N[2]-1)); ck(900,"Sum of consecutive integers",(q,N)=>{let s=0;for(let i=N[0];i<=N[1];i++)s+=i;return s;});
ck(900,"Telescoping sum",(q)=>{const m=[...q.matchAll(/\\dfrac1\{(\d+)\\cdot(\d+)\}/g)].pop();return +m[1]/+m[2];});
ck(900,"Larger root of a quadratic",(q,N)=>{const S=N[1],P=N[2];return (S+Math.sqrt(S*S-4*P))/2;}); ck(900,"Difference of squares",(q,N)=>N[0]*N[0]-N[2]*N[2]); /* N = [a,2,b,2] */
ck(900,"Sum of absolute-value solutions",(q,N)=>{let s=0;for(let x2=-400;x2<=400;x2++)if(Math.abs(x2-N[1])===N[2])s+=x2/2;return s;});
ck(900,"Similar triangles",(q,N)=>N[2]*N[1]/N[0]); ck(900,"Area from coordinates",(q,N)=>Math.abs(N[2]*N[5])/2);
ck(900,"Regular polygon angle",(q,N)=>{ if(/exterior angle, in degrees, of a regular polygon with/.test(q))return 360/N[0]; if(/interior angle, in degrees, of a regular polygon with/.test(q))return 180-360/N[0]; if(/Each interior angle of a regular polygon is/.test(q))return 360/(180-N[0]); return 360/N[0]; });
ck(900,"Midpoint of a segment",(q)=>{const [[a,b],[c,d]]=pts(q);return (a+c)/2+(b+d)/2;}); ck(900,"Similar figures: area",(q,N)=>N[2]*N[1]**2/N[0]**2); ck(900,"Distance between lattice points",(q)=>{const [[a,b],[c,d]]=pts(q);return Math.hypot(c-a,d-b);});
ck(900,"Committee with a condition",(q,N)=>Number(binom(N[0]+N[1],N[2])-binom(N[0],N[2])));
ck(900,"At least one of a face",(q,N)=>1-((N[1]-1)/N[1])**N[0]); ck(900,"Adjacent arrangement",(q,N)=>Number(factorial(N[1])*factorial(N[0]-N[1]+1)));
ck(900,"Seating around a table",(q,N)=>/NOT/.test(q)?Number(factorial(N[0]-1)-2n*factorial(N[0]-2)):/next to each other/.test(q)?Number(2n*factorial(N[0]-2)):Number(factorial(N[0]-1)));
ck(900,"GCD-LCM relation",(q,N)=>N[0]*N[1]/N[2]); ck(900,"Last two digits",(q,N)=>powmod(N[0],N[1],100));
ck(900,"Divisors of a three-prime number",(q)=>{const m=[...q.matchAll(/(\d+)\^\{(\d+)\}/g)];return m.reduce((a,x)=>a*(+x[2]+1),1);});
ck(900,"Divisors that are multiples",(q)=>{const m=q.match(/2\^\{(\d+)\}\\cdot3\^\{(\d+)\}\\cdot5\^\{(\d+)\}\$ are multiples of (\d+)/);const N=2**m[1]*3**m[2]*5**m[3];return divisors(N).filter(d=>d%+m[4]===0).length;});
// ================= LEVEL 1000 =================
ck(1000,"Arithmetic series sum",(q,N)=>{const n=N[0],a=N[1],d=N[2]-N[1];let s=0;for(let i=0;i<n;i++)s+=a+i*d;return s;});
ck(1000,"Radical equation",(q)=>{const m=q.match(/\\sqrt\{x([+-]\d+)?\}=x-(\d+)/);const a=m[1]?+m[1]:0,b=+m[2];let sol=null;for(let x=b;x<5000;x++)if(x+a>=0&&Math.abs(Math.sqrt(x+a)-(x-b))<1e-9)sol=x;return sol;});
ck(1000,"Logarithm equation",(q)=>{const m=q.match(/x>(\d+)\$ of \$\\log_(\d+) x\+\\log_\d+\(x-\d+\)=(\d+)\$/);const c=+m[1],b=+m[2],n=+m[3];return (c+Math.sqrt(c*c+4*b**n))/2;});
ck(1000,"Exponent equation",(q)=>{const m=q.match(/\$(\d+)\^\{(\d*)x([+-]\d+)?\}=(\d+)\$/);const b=+m[1],mm=m[2]===""?1:+m[2],c=m[3]?+m[3]:0,V=+m[4];for(let x=1;x<200;x++)if(b**(mm*x+c)===V)return x;});
ck(1000,"Sum of squares of roots",(q)=>{const m=q.match(/x\^2-(\d+)x([+-]\d+)?=0/);const S=+m[1],P=m[2]?+m[2]:0;const disc=S*S-4*P;if(disc>=0){const d=Math.sqrt(disc);return ((S+d)/2)**2+((S-d)/2)**2;}const re=S/2,im=Math.sqrt(-disc)/2;return 2*(re*re-im*im);});
ck(1000,"Composition of functions",(q)=>{const m=q.match(/f\(x\)=(\d+)x\+(\d+)\$ and \$g\(x\)=x\^2-(\d+)\$\. What is \$g\(f\((\d+)\)\)\+f\(g\((\d+)\)\)/);const [a,b,c,p,qq]=m.slice(1).map(Number);const f=x=>a*x+b,g=x=>x*x-c;return g(f(p))+f(g(qq));});
ck(1000,"Law of cosines",(q,N)=>Math.round(N[0]**2+N[1]**2-2*N[0]*N[1]*Math.cos(N[2]*Math.PI/180)));
ck(1000,"Inradius of a right triangle",(q,N)=>N[0]*N[1]/(N[0]+N[1]+N[2])); ck(1000,"Regular hexagon area",(q,N)=>/hexagon/.test(q)?6*(N[0]/2)**2:(N[0]/2)**2);
ck(1000,"Heron's formula",(q,N)=>heron(N[0],N[1],N[2])); ck(1000,"Altitude of a triangle",(q,N)=>2*N[3]/N[4]);
ck(1000,"Inclusion-exclusion (none)",(q)=>{const m=q.match(/from 1 to (\d+) are divisible by none of ([\d, ]+)\?/);const ps=m[2].split(",").map(Number);let c=0;for(let i=1;i<=+m[1];i++)if(ps.every(p=>i%p))c++;return c;});
ck(1000,"Stars and bars",(q,N)=>{const k=N[0],n=N[1];let dp=Array(n+1).fill(0);dp[0]=1;for(let i=0;i<k;i++){const nx=Array(n+1).fill(0);for(let s=0;s<=n;s++)for(let v=0;s+v<=n;v++)nx[s+v]+=dp[s];dp=nx;}return dp[n];});
ck(1000,"Arrangements with repeats",(q)=>{const w=q.match(/letters of ([A-Z]+)\?/)[1];const cnt={};for(const c of w)cnt[c]=(cnt[c]||0)+1;let left=w.length,v=1n;for(const c in cnt){v*=binom(left,cnt[c]);left-=cnt[c];}return Number(v);});
ck(1000,"Sum of divisors",(q,N)=>sum(divisors(N[0]))); ck(1000,"Trailing zeros of a factorial",(q,N)=>{const s=factorial(N[0]).toString();return s.length-s.replace(/0+$/,"").length;});
ck(1000,"Square divisors",(q)=>{const m=q.match(/2\^\{(\d+)\}\\cdot3\^\{(\d+)\}\\cdot5\^\{(\d+)\}/);let c=0;for(let a=0;a<=+m[1];a++)for(let b=0;b<=+m[2];b++)for(let e=0;e<=+m[3];e++)if(a%2===0&&b%2===0&&e%2===0)c++;return c;});
ck(1000,"Factorial sum remainder",(q,N)=>{let s=0n;for(let i=1n;i<=BigInt(N[2]);i++)s+=factorial(i);return Number(s%BigInt(N[3]));}); /* N = [1,2,n,m] */
// ================= LEVEL 1100 =================
ck(1100,"Infinite geometric series",(q,N)=>N[0]/(1-N[2]/N[3])); /* N = [a,a,p,q,a,p,q,2] */ ck(1100,"Sum of k(k+1)",(q,N)=>{let s=0;for(let k=1;k<=N[1];k++)s+=k*(k+1);return s;}); /* N = [1,n,1] */
ck(1100,"Sum of cubes",(q,N)=>{let s=0;for(let k=1;k<=N[4];k++)s+=k**3;return s;}); ck(1100,"Sum of squares",(q,N)=>{let s=0;for(let k=1;k<=N[4];k++)s+=k*k;return s;}); // N = [1,e,2,e,n,e]
ck(1100,"Vieta for a cubic",(q)=>powerSum(q,2));
ck(1100,"Polynomial remainder",(q)=>{const m=q.match(/remainder \$(-?\d+)\$ when divided by \$x-1\$ and remainder \$(-?\d+)\$ when divided by \$x-2\$.*R\((\d+)\)/);const u=+m[1],v=+m[2],k=+m[3];return u+(v-u)*(k-1);});
ck(1100,"Functional equation",(q)=>{const kk=+q.match(/f\(x\)\+(\d+)f/)[1],a=+q.match(/What is \$f\((\d+)\)\$/)[1];return (a-kk/a)/(1-kk*kk);});
ck(1100,"Trig: sin 2θ",(q)=>{const m=q.match(/=\\frac\{(\d+)\}\{(\d+)\}/);const th=Math.asin(m[1]/m[2]/Math.SQRT2)-Math.PI/4;return Math.sin(2*th);});
ck(1100,"Distance to a line",(q,N)=>{const m=q.match(/point \$\((-?\d+),(-?\d+)\)\$ to the line \$(\d+)x\+(\d+)y=(\d+)\$/);const [x0,y0,a,b,c]=m.slice(1).map(Number);return Math.abs(a*x0+b*y0-c)/Math.hypot(a,b);});
ck(1100,"Angle bisector segment",(q)=>{const [ab,ac,bc]=[...q.matchAll(/=(\d+)\$/g)].map(m=>+m[1]);const x=(ab*ab+bc*bc-ac*ac)/(2*bc),y=Math.sqrt(ab*ab-x*x);const ux=(0-x)/ab+(bc-x)/ac,uy=(0-y)/ab+(0-y)/ac;return x+(-y/uy)*ux;});
ck(1100,"Circumradius",(q,N)=>{const [a,b,c]=N;const A=Math.acos((b*b+c*c-a*a)/(2*b*c));return a/(2*Math.sin(A));}); ck(1100,"Inradius from area",(q,N)=>heron(N[0],N[1],N[2])/((N[0]+N[1]+N[2])/2));
ck(1100,"Distribution, at least one each",(q,N)=>{const n=N[0],k=N[1];let dp=Array(n+1).fill(0);dp[0]=1;for(let i=0;i<k;i++){const nx=Array(n+1).fill(0);for(let s=0;s<=n;s++)for(let v=1;s+v<=n;v++)nx[s+v]+=dp[s];dp=nx;}return dp[n];});
ck(1100,"Dice sums",(q)=>{const m=q.match(/^(\d+) fair (\d+)-sided/);const n=+m[1],f=+m[2],s=+q.match(/exactly (\d+)/)[1];let dp={0:1};for(let i=0;i<n;i++){const nx={};for(const k in dp)for(let v=1;v<=f;v++)nx[+k+v]=(nx[+k+v]||0)+dp[k];dp=nx;}const c=dp[s]||0;return /In how many/.test(q)?c:c/f**n;});
ck(1100,"No two adjacent",(q,N)=>{ if(/element subsets/.test(q)){const k=N[0],n=N[2]??N[1];const nn=+q.match(/\\\{1,2,\\ldots,(\d+)\\\}/)[1];const dp=Array.from({length:nn+2},()=>Array.from({length:k+1},()=>[0,0]));dp[0][0][0]=1;for(let i=0;i<nn;i++)for(let j=0;j<=k;j++)for(const last of [0,1]){const c=dp[i][j][last];if(!c)continue;dp[i+1][j][0]+=c;if(!last&&j<k)dp[i+1][j+1][1]+=c;}return dp[nn][k][0]+dp[nn][k][1];} const nn=+q.match(/\\\{1,2,\\ldots,(\d+)\\\}/)[1];let c0=1,c1=1;for(let i=1;i<nn;i++){[c0,c1]=[c0+c1,c0];}return c0+c1; });
ck(1100,"Derangements",(q)=>{const n=+q.match(/\\\{1,\\ldots,(\d+)\\\}/)[1];const m=q.match(/exactly (\d+) fixed/);const k=m?+m[1]:0;let s=0n;for(let j=k;j<=n;j++)s+=(((j-k)%2)?-1n:1n)*binom(j,k)*factorial(n)/factorial(j);return Number(s);});
ck(1100,"Exactly k heads",(q,N)=>{const n=N[0],k=N[1];const row=[1];for(let i=0;i<n;i++){const nx=[1];for(let j=1;j<=i;j++)nx.push(row[j-1]+row[j]);nx.push(1);row.length=0;row.push(...nx);}return row[k]/2**n;});
ck(1100,"Euler's totient",(q,N)=>{let c=0;for(let i=1;i<=N[1];i++)if(gcd(i,N[1])===1)c++;return c;}); ck(1100,"Power mod 100",(q,N)=>powmod(N[0],N[1],100));
ck(1100,"Ordered pairs with a given LCM",(q,N)=>{const n=N[0],d=divisors(n);let c=0;for(const a of d)for(const b of d)if(lcm(a,b)===n)c++;return c;});
ck(1100,"Divisors of a factorial",(q,N)=>{const n=N[0];let f=factorial(n);const mode=/odd/.test(q)?"odd":/even/.test(q)?"even":"all";let c=1;for(let p=2n;p<=BigInt(n);p++){let e=0;while(f%p===0n){f/=p;e++;}if(!e)continue;c*=(p===2n&&mode==="odd")?1:(p===2n&&mode==="even")?e:e+1;}return c;});
ck(1100,"Sum of divisors",(q,N)=>sum(divisors(N[0])));
// ================= LEVEL 1200 =================
ck(1200,"Power sums by recurrence",(q)=>{const m=q.match(/x\^2-(\d*)x-(\d*)=0\$\. What is \$a\^\{(\d+)\}/);const p=m[1]===""?1:+m[1],qq=m[2]===""?1:+m[2],n=+m[3];const d=Math.sqrt(p*p+4*qq),a=(p+d)/2,b=(p-d)/2;return Math.round(a**n+b**n);});
ck(1200,"Sum of n / r^n",(q)=>{const m=q.match(/displaystyle(\d*)\\sum_\{n=1\}\^\{\\infty\}\\frac\{n\}\{(\d+)\^n\}/);const c=m[1]===""?1:+m[1],r=+m[2];let s=0;for(let n=1;n<600;n++)s+=n/r**n;return c*s;});
ck(1200,"Telescoping with 1/(k(k+2))",(q,N)=>{let s=0;for(let k=1;k<=+q.match(/\^\{(\d+)\}/)[1];k++)s+=1/(k*(k+2));return s;});
ck(1200,"Sum of cubes of roots",(q)=>powerSum(q,3));
ck(1200,"Quadratic from three values",(q,N)=>{const m=q.match(/P\(0\)=(-?\d+)\$, \$P\(1\)=(-?\d+)\$ and \$P\(2\)=(-?\d+)\$\. What is \$P\((\d+)\)/);const [p0,p1,p2,k]=m.slice(1).map(Number);return p0*(k-1)*(k-2)/2-p1*k*(k-2)+p2*k*(k-1)/2;});
ck(1200,"Floor sum",(q,N)=>{let s=0;for(let k=1;k<=N[1];k++)s+=Math.floor(k/N[2]);return s;});
ck(1200,"Brahmagupta area squared",(q)=>{const [a,b,c,d]=nums(q.match(/sides ([\d, ]+)\./)[1]);const p=Math.sqrt((a*c+b*d)*(a*d+b*c)/(a*b+c*d));const A=heron(a,b,p)+heron(c,d,p);return A*A;});
ck(1200,"Power of a point",(q,N)=>{ if(/PT\^2/.test(q))return N[0]*N[1]; return N[0]*N[1]/N[2]; });
ck(1200,"Lattice points in a triangle",(q)=>{const m=q.match(/\(0,0\)\$, \$\((\d+),0\)\$, \$\(0,(\d+)\)/);const a=+m[1],b=+m[2];let c=0;for(let x=0;x<=a;x++)c+=Math.floor(b*(a-x)/a+1e-12)+1;return c;});
ck(1200,"Exactly one of three",(q,N)=>{const [n,a,b,c]=[N[3],N[0],N[1],N[2]];const m=q.match(/from 1 to (\d+) are divisible by exactly one of (\d+), (\d+), and (\d+)/);let cnt=0;for(let i=1;i<=+m[1];i++)if(((i%+m[2]===0)+(i%+m[3]===0)+(i%+m[4]===0))===1)cnt++;return cnt;});
ck(1200,"Expected value",(q)=>{const m=q.match(/fair (\d+)-sided.*multiple of (\d+) you win (\d+) dollars/);const [n,mm,w]=m.slice(1).map(Number);let e=0;for(let i=1;i<=n;i++)e+=(i%mm===0?w:-1)/n;return e;});
ck(1200,"Catalan paths",(q)=>{const m=q.match(/\(0,0\)\$ to \$\((\d+),(\d+)\)/);const a=+m[1],b=+m[2];const dp=Array.from({length:a+1},()=>Array(b+1).fill(0));for(let x=0;x<=a;x++)for(let y=0;y<=Math.min(b,x);y++){dp[x][y]=(x===0&&y===0)?1:(x?dp[x-1][y]:0)+(y?dp[x][y-1]:0);}return dp[a][b];});
ck(1200,"Non-adjacent chairs",(q,N)=>{const k=N[0],n=N[1];let c=0;const rec=(start,left)=>{if(!left){c++;return;}for(let i=start;i<=n;i++)rec(i+2,left-1);};rec(1,k);return c;});
ck(1200,"Chinese Remainder Theorem",(q,N)=>{const m=q.match(/x\\equiv(\d+)\\pmod\{(\d+)\}\$ and \$x\\equiv(\d+)\\pmod\{(\d+)\}/);for(let x=1;;x++)if(x%+m[2]===+m[1]&&x%+m[4]===+m[3])return x;});
ck(1200,"Linear Diophantine count",(q,N)=>{let c=0;for(let x=1;x<N[2];x++)for(let y=1;y<N[2];y++)if(N[0]*x+N[1]*y===N[2])c++;return c;});
ck(1200,"Last three digits",(q,N)=>powmod(N[0],N[1],1000));
ck(1200,"Square roots of 1 mod n",(q)=>{const n=+q.match(/lt(\d+)\$/)[1];let c=0;for(let x=0;x<n;x++)if(BigInt(x)*BigInt(x)%BigInt(n)===1n)c++;return c;});
// ================= LEVEL 1300 =================
ck(1300,"Sum of floors of N/k",(q,N)=>{const n=N[1];let s=0;for(let k=1;k<=n;k++)s+=Math.floor(n/k);return s;}); // N = [1,n,n]
ck(1300,"Fibonacci-like mod 100",(q,N)=>{const n=N[N.length-2]>=0?+q.match(/F_\{(\d+)\}/)[1]:0;let a=0n,b=1n;for(let i=0;i<n;i++)[a,b]=[b,a+b];return Number(a%100n);});
ck(1300,"Telescoping 1/(k²-1)",(q)=>{let s=0;for(let k=2;k<=+q.match(/\^\{(\d+)\}/)[1];k++)s+=1/(k*k-1);return s;});
ck(1300,"Newton sums (fourth powers)",(q)=>powerSum(q,4));
ck(1300,"Sum of reciprocals of roots",(q)=>{const {c2,c1,c0}=cubic(q);return roots3(c2,c1,c0).reduce((s,z)=>s+cd([1,0],z)[0],0);});
ck(1300,"Reciprocal-sum equation (SFFT)",(q)=>{const n=+q.match(/=\\frac1\{(\d+)\}/)[1];let c=0;for(let x=n+1;x<=n+n*n;x++)if((n*x)%(x-n)===0)c++;return c;});
ck(1300,"Lattice points in a circle",(q,N)=>{const n=N[N.length-1];let c=0;for(let x=-40;x<=40;x++)for(let y=-40;y<=40;y++)if(x*x+y*y<=n)c++;return c;});
ck(1300,"Product of inradius and circumradius",(q,N)=>{const [a,b,c]=N;const K=heron(a,b,c),s=(a+b+c)/2;return (K/s)*(a*b*c/(4*K));});
ck(1300,"Lattice points on a circle",(q,N)=>{const n=N[N.length-1];let c=0;for(let x=-60;x<=60;x++)for(let y=-60;y<=60;y++)if(x*x+y*y===n)c++;return c;});
const AV={"three 1s in a row":["111"],"two 1s in a row":["11"],"three equal digits in a row":["000","111"],"the pattern 101":["101"],"the pattern 110":["110"],"the patterns 010 or 101":["010","101"]};
ck(1300,"Binary strings avoiding a pattern",(q,N)=>{const n=N[0];const desc=q.match(/do not contain (.*)\?$/)[1];const pats=AV[desc];if(n<=20)return avoidBrute(n,pats);
  // longer strings: independent count via explicit state machine over the last two digits
  let st=new Map([["",1]]);for(let i=0;i<n;i++){const nx=new Map();for(const [s,c] of st)for(const ch of "01"){const u=s+ch;if(pats.some(p=>u.endsWith(p)))continue;const k=u.slice(-2);nx.set(k,(nx.get(k)||0)+c);}st=nx;}return sum([...st.values()]);});
ck(1300,"Tiling a strip",(q,N)=>{ if(/dominoes and \$2\\times2\$/.test(q)){const n=+q.match(/2\\times(\d+)\$ rectangle/)[1];const g=[[],[]];let cnt=0;const grid=[Array(n).fill(0),Array(n).fill(0)];const rec=()=>{let r=-1,cc=-1;outer:for(let j=0;j<n;j++)for(let i=0;i<2;i++)if(!grid[i][j]){r=i;cc=j;break outer;}if(r<0){cnt++;return;}
      if(r===0&&!grid[1][cc]){grid[0][cc]=grid[1][cc]=1;rec();grid[0][cc]=grid[1][cc]=0;}
      if(cc+1<n&&!grid[r][cc+1]){grid[r][cc]=grid[r][cc+1]=1;rec();grid[r][cc]=grid[r][cc+1]=0;}
      if(r===0&&cc+1<n&&!grid[1][cc]&&!grid[0][cc+1]&&!grid[1][cc+1]){grid[0][cc]=grid[1][cc]=grid[0][cc+1]=grid[1][cc+1]=1;rec();grid[0][cc]=grid[1][cc]=grid[0][cc+1]=grid[1][cc+1]=0;}};
    if(n<=16){rec();return cnt;} const f=[1,1];for(let i=2;i<=n;i++)f[i]=f[i-1]+2*f[i-2];return f[n]; }
  const n=+q.match(/1\\times(\d+)\$ strip/)[1],parts=q.match(/tiles of length ([\d, ]+) \(/)[1].split(",").map(Number);const memo={};const f=m=>m===0?1:m<0?0:memo[m]!==undefined?memo[m]:(memo[m]=sum(parts.map(p=>f(m-p))));return f(n); });
ck(1300,"Permutations with fixed points",(q,N)=>{const n=+q.match(/\\\{1,\\ldots,(\d+)\\\}/)[1],k=+q.match(/exactly (\d+) element/)[1];let s=0n;for(let j=k;j<=n;j++)s+=(((j-k)%2)?-1n:1n)*binom(j,k)*factorial(n)/factorial(j);return Number(s);});
ck(1300,"Lattice paths through a point",(q,N)=>{const [a,b,c,d]=N.slice(-6).length===6?[N[N.length-6+0],N[N.length-5],N[N.length-2],N[N.length-1]]:N;const m=q.match(/\(0,0\)\$ to \$\((\d+),(\d+)\)\$ and pass through the point \$\((\d+),(\d+)\)\$/);const [A,B,Cx,Dy]=m.slice(1).map(Number);const dp=Array.from({length:A+1},()=>Array.from({length:B+1},()=>[0,0]));dp[0][0][(0===Cx&&0===Dy)?1:0]=1;for(let x=0;x<=A;x++)for(let y=0;y<=B;y++)for(const f of [0,1]){const v=dp[x][y][f];if(!v)continue;for(const [dx,dy] of [[1,0],[0,1]]){const nx=x+dx,ny=y+dy;if(nx>A||ny>B)continue;const nf=f||(nx===Cx&&ny===Dy)?1:0;dp[nx][ny][nf]+=v;}}return dp[A][B][1];});
ck(1300,"Power of 2 mod 1000",(q,N)=>powmod(2,N[1],1000));
ck(1300,"Divisibility count",(q,N)=>{const m=q.match(/1\\le n\\le(\d+)\$ is \$n\(n\+1\)\(n\+2\)\$ divisible by (\d+)/);let c=0;for(let n=1;n<=+m[1];n++)if(n*(n+1)*(n+2)%+m[2]===0)c++;return c;});
ck(1300,"Pairs with LCM equal to N",(q)=>{const n=+q.match(/lcm\}\(a,b\)=(\d+)/)[1];const d=divisors(n);let c=0;for(const a of d)for(const b of d)if(lcm(a,b)===n)c++;return c;});

// ================= run =================
const close = (a, b) => Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(b));
let checked = 0, bad = 0, unchecked = new Set(); const perSkill = {}; const t0 = Date.now();
for (const L of D.LEVELS) for (let k = 0; k < D.PER_LEVEL; k += quick ? 7 : 1) { // step 7 is coprime with 5, so quick mode still rotates through all five subjects
  const it = D.gen(L, k), key = L + "|" + it.skill, f = CK[key];
  if (!f) { unchecked.add(key); continue; }
  let exp; try { exp = f(it.q, nums(it.q)); } catch (e) { console.log("CHECKER ERROR", it.id, key, e.message, "\n   ", it.q.slice(0, 160)); bad++; continue; }
  checked++; perSkill[key] = (perSkill[key] || 0) + 1;
  if (typeof exp !== "number" || !Number.isFinite(exp) || !close(it.v, exp)) { if (bad < 40) console.log("MISMATCH", it.id, `[${key}]`, "key:", it.show, "| independent:", exp, "\n   ", it.q.slice(0, 200)); bad++; }
}
const skillsTotal = D.LEVELS.reduce((a, L) => a + D.STRANDS.reduce((b, s) => b + D.REG[L][s].length, 0), 0);
const covered = Object.keys(perSkill).length;
console.log(`\n${checked} items independently verified across ${covered} of ${skillsTotal} skills in ${((Date.now() - t0) / 1000).toFixed(0)}s; ${bad} mismatch/error(s).`);
if (unchecked.size) { console.log("SKILLS WITH NO CHECKER:", [...unchecked].join("; ")); bad++; }
process.exit(bad ? 1 : 0);
