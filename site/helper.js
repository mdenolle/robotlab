// Robot Helper: a library of 20 famous real robots, each with an instruction
// book for a mini version you can build. Search picks the book; there is no AI
// behind it yet. Robots not in the library get an honest "not yet".
(() => {
  const form = $('h-form');
  if (!form) return;

  const ROBOTS = [
    {id:'perseverance', name:'Perseverance', aka:['mars rover','nasa rover','percy','rover'], who:'NASA', when:'landed on Mars in 2021', kind:'Space',
     real:'Perseverance is a car-sized rover exploring Jezero Crater on Mars, looking for signs of ancient life. Its six wheels sit on a “rocker-bogie” frame that lets it climb over rocks without tipping.',
     mini:'Rock-climbing cardboard rover', level:'Beginner', time:'1–2 hours', code:false,
     parts:['Cardboard (a cereal box works)','6 bottle caps for wheels','3 wooden skewers or straws for axles','Paper fasteners (brads)','Tape and glue','Scissors'],
     steps:['Cut two long cardboard strips (the “rockers”) and two short strips (the “bogies”).','Join each short strip to the back end of a long strip with a paper fastener so it can swing.','Poke skewers through the strips to make three axles on each side, and push a bottle cap onto each end.','Join the two sides with a cardboard box on top, fixed to the middle of each long strip with a fastener so the sides can tilt.','Push your rover slowly over a pile of books and watch the wheels stay on the ground.'],
     safety:'Ask an adult to poke holes in the cardboard and caps with a sharp tool.', tryit:'Build a “Mars” course with books and pencils. How high a bump can your rover climb?'},
    {id:'ingenuity', name:'Ingenuity', aka:['mars helicopter','helicopter','drone','nasa helicopter'], who:'NASA', when:'first flew on Mars in 2021', kind:'Space',
     real:'Ingenuity was the first aircraft to make a powered, controlled flight on another planet. Mars air is very thin, so its rotors had to spin very fast to lift it. It flew 72 times.',
     mini:'Paper rotor copter', level:'Beginner', time:'20 minutes', code:false,
     parts:['Paper (printer paper is fine)','Scissors','1 paper clip','Ruler and pencil'],
     steps:['Cut a paper strip about 5 cm wide and 20 cm long.','Cut down the middle from the top, about halfway. These are the two rotor blades.','Fold one blade forward and the other blade backward.','Fold the bottom half in from both sides to make a narrow body, and clip a paper clip to the bottom.','Drop it from as high as you safely can and watch it spin down.'],
     safety:'Only drop it from a safe place, like standing on the floor with your arm up, never from a balcony or window.', tryit:'Make the blades shorter, then longer. Which one falls slowest? That is the same question NASA asked for thin Mars air.'},
    {id:'opportunity', name:'Opportunity', aka:['oppy','solar rover','mars exploration rover'], who:'NASA', when:'worked on Mars from 2004 to 2018', kind:'Space',
     real:'Opportunity was planned to work for 90 days on Mars and kept going for over 14 years, driving about 45 km. It ran on sunlight from its solar panels.',
     mini:'Sun-powered mini rover', level:'Beginner', time:'1–2 hours', code:false,
     parts:['Small solar panel (about 5 V)','Small DC motor that works with the panel (solar motor kits pair them)','4 wheels and 2 axles, or bottle caps and skewers','Small box or a piece of foam board for the body','Double-sided tape'],
     steps:['Tape the motor to the underside of the body near the back.','Fix the back axle so the motor turns it, by pressing a wheel straight onto the motor shaft or using a rubber-band belt.','Add the front axle with free-spinning wheels.','Tape the solar panel on top and connect its two wires to the motor.','Take it into bright sunlight and watch it go. If it goes backward, swap the two wires.'],
     safety:'Never look at the Sun. Solar panels are safe to touch.', tryit:'Cover half the panel with paper. What happens to the speed? That is why dust on Opportunity’s panels mattered.'},
    {id:'lunokhod', name:'Lunokhod 1', aka:['lunokhod','moon rover','lunar rover','soviet rover'], who:'Soviet Union', when:'landed on the Moon in 1970', kind:'Space',
     real:'Lunokhod 1 was the first robot rover to drive on another world. A team on Earth steered it by remote control, waiting for pictures to arrive before each move.',
     mini:'Wired remote-control rover', level:'Intermediate', time:'An afternoon', code:false,
     parts:['2 small gear motors with wheels (yellow “TT” motors)','A caster or a smooth bead for the front','2 × AA battery holder with batteries','2 push buttons','About 2 m of thin two-colour wire','A small box for the remote and a piece of cardboard for the body'],
     steps:['Glue the two motors to the back of the body, one on each side, and add the caster at the front.','Run the long wires from the rover to the remote box.','Wire the left button so pressing it connects the battery to the left motor. Do the same for the right motor.','Press both buttons: it drives forward. Press one: it turns.','If a wheel spins backward, swap that motor’s two wires.'],
     safety:'Ask an adult to help strip and join the wires. Take the batteries out when you change wiring.', tryit:'Steer it while looking only at a phone video of the rover, like the Lunokhod drivers who could only see pictures.'},
    {id:'canadarm2', name:'Canadarm2', aka:['canadarm','space arm','robot arm space','iss arm'], who:'Canadian Space Agency', when:'working on the Space Station since 2001', kind:'Space',
     real:'Canadarm2 is a 17-metre robotic arm on the International Space Station. Astronauts use it to catch visiting cargo ships and move equipment around the station.',
     mini:'Cardboard grabber arm', level:'Beginner', time:'1 hour', code:false,
     parts:['2 long strips of stiff cardboard (about 50 cm)','String','2 rubber bands','A few straws','Tape and paper fasteners'],
     steps:['Join the two strips near one end with a paper fastener so the short ends make jaws.','Tape a rubber band between the long ends so the jaws spring open.','Tape straws along one strip as a guide and thread a string through them to the jaws.','Tie the string so pulling it closes the jaws.','Practise picking up a paper cup from across a table.'],
     safety:'Keep the jaws away from faces.', tryit:'Try catching a slowly rolling ball, like Canadarm2 catching a cargo ship.'},
    {id:'robonaut', name:'Robonaut 2', aka:['robonaut','r2','nasa humanoid','space robot hand'], who:'NASA and General Motors', when:'went to the Space Station in 2011', kind:'Space',
     real:'Robonaut 2 was a humanoid robot built to use the same tools as astronauts. Its hands had tendons, like the strings in your own hand, that pulled the fingers closed.',
     mini:'Straw-and-string robot hand', level:'Beginner', time:'1 hour', code:false,
     parts:['Cardboard','5 straws','String or yarn','Tape','Scissors'],
     steps:['Trace your hand on cardboard and cut it out.','Draw lines where your finger joints bend and fold the cardboard along them.','Cut straw pieces and tape them along each finger between the folds.','Thread a string through each finger’s straws and tape it to the fingertip.','Pull the strings at the wrist and watch the fingers curl.'],
     safety:'Ask for help with scissors on thick cardboard.', tryit:'Can your robot hand hold a cup? Which finger matters most?'},
    {id:'spot', name:'Spot', aka:['robot dog','boston dynamics dog','dog robot','four legged robot'], who:'Boston Dynamics', when:'for sale since 2020', kind:'Walking robots',
     real:'Spot is a four-legged robot that can climb stairs, open doors and walk over rough ground. Companies use it to inspect factories and building sites.',
     mini:'Two-motor walking robot dog', level:'Advanced', time:'A weekend', code:true,
     parts:['Arduino Uno and USB cable','2 micro servos (SG90)','Craft sticks for legs','A small box or foam board for the body','4 × AA battery holder for the servos','Jumper wires and hot glue'],
     steps:['Glue one servo at the front of the body and one at the back, with the arms pointing down.','Glue a craft stick across each servo arm so it makes a pair of legs.','Wire the servos to the Arduino (signal wires to pins 9 and 10) and power them from the battery holder.','Write code that rocks the front legs one way while the back legs rock the other way, then swaps.','Try different angles and speeds until it shuffles forward.'],
     safety:'Hot glue: adult help. Power servos from the battery pack, not the Arduino.', tryit:'Make it walk backward by changing the order of the moves.'},
    {id:'atlas', name:'Atlas', aka:['boston dynamics humanoid','parkour robot','humanoid'], who:'Boston Dynamics', when:'first shown in 2013', kind:'Walking robots',
     real:'Atlas is a humanoid robot famous for videos of it running, jumping and doing backflips. The first versions moved using hydraulics: liquid pushed through tubes to move pistons.',
     mini:'Syringe-powered hydraulic arm', level:'Intermediate', time:'An afternoon', code:false,
     parts:['4 plastic syringes without needles (10 ml)','About 1 m of clear tubing that fits the syringes','Cardboard or craft sticks','Paper fasteners','Water (add food colouring to see it move)'],
     steps:['Build a two-part arm from cardboard, joined at an elbow with a paper fastener.','Fill a syringe and tubing with water, connect a second empty syringe at the other end, and push to check the water moves.','Tape one syringe pair so pushing it bends the elbow.','Add the second pair to lift the whole arm at the shoulder.','Control the arm with the two syringes in your hands.'],
     safety:'Use syringes without needles only. Work on a tray in case of spills.', tryit:'Swap the water for air. Is the arm still as strong? That is why big robots used liquid.'},
    {id:'asimo', name:'ASIMO', aka:['honda robot','walking robot','honda'], who:'Honda', when:'introduced in 2000', kind:'Walking robots',
     real:'ASIMO was one of the first humanoid robots that could walk smoothly, climb stairs and even run. Engineers spent years teaching it to balance.',
     mini:'Ramp walker (walks with no motor)', level:'Intermediate', time:'1–2 hours', code:false,
     parts:['Craft sticks or stiff card','A wooden skewer','2 beads or a small nut for weight','Hot glue','A book or board for a gentle ramp'],
     steps:['Make two legs the same length and join them at the top with a skewer so they swing freely.','Glue small, curved feet to the bottom of each leg.','Add a little weight low on each leg.','Set it on a slight ramp and give it a tiny nudge.','Adjust the ramp angle and the weight until it rocks from foot to foot and steps down.'],
     safety:'Hot glue: adult help.', tryit:'How steep can the ramp be before it falls? Balance is the hardest part of walking, for robots too.'},
    {id:'unimate', name:'Unimate', aka:['first robot arm','factory robot','industrial robot','robot arm'], who:'George Devol and Joseph Engelberger', when:'started work in a General Motors factory in 1961', kind:'Factory and hospital',
     real:'Unimate was the first industrial robot. It lifted hot metal parts in a car factory, a job that was dangerous for people.',
     mini:'Three-motor robot arm with control knobs', level:'Advanced', time:'A weekend', code:true,
     parts:['Arduino Uno and USB cable','3 micro servos (SG90)','3 knobs (10 kΩ potentiometers)','Breadboard and jumper wires','Cardboard or craft sticks for the arm','4 × AA battery holder for the servos'],
     steps:['Build a base that turns, an upper arm and a gripper from cardboard, with a servo at each joint.','Put the three knobs on the breadboard and wire their middle pins to A0, A1 and A2.','Wire the servo signal wires to pins 9, 10 and 11, powered from the battery holder.','Write code that reads each knob and turns its servo to match.','Practise moving a small block from one spot to another.'],
     safety:'Power servos from the battery pack, not the Arduino.', tryit:'Make the arm repeat a move by itself: record the knob positions, then play them back.'},
    {id:'aibo', name:'AIBO', aka:['aibo','sony dog','robot pet','robot puppy'], who:'Sony', when:'first sold in 1999', kind:'Home and pets',
     real:'AIBO is a robot puppy that reacts when you pet it, plays with a ball and learns its owner’s face. Sony brought a new version back in 2018.',
     mini:'Robot pet that wags its tail when you pet it', level:'Intermediate', time:'An afternoon', code:true,
     parts:['Arduino Uno and USB cable','1 micro servo (SG90)','1 touch sensor module (TTP223)','Pipe cleaner or felt for the tail','A small box to decorate as the pet','Jumper wires'],
     steps:['Decorate the box as your pet and fix the touch sensor on its head.','Mount the servo at the back and attach the tail to its arm.','Wire the touch sensor to pin 2 and the servo to pin 9.','Write code: when the head is touched, swing the tail back and forth a few times.','Give your pet a name.'],
     safety:'Keep wires inside the box so they don’t get pulled.', tryit:'Make it wag faster the longer you pet it.'},
    {id:'kismet', name:'Kismet', aka:['kismet','mit robot face','emotion robot','robot face'], who:'MIT (Cynthia Breazeal)', when:'built in the late 1990s', kind:'Home and pets',
     real:'Kismet was a robot head that showed feelings with its eyebrows, ears and lips. It was built to study how people and robots understand each other.',
     mini:'Face that shows feelings with moving eyebrows', level:'Intermediate', time:'An afternoon', code:true,
     parts:['Arduino Uno and USB cable','2 micro servos (SG90)','2 push buttons','Cardboard for the face','Pipe cleaners for eyebrows','Jumper wires'],
     steps:['Draw a face on cardboard and fix a servo behind each eyebrow spot.','Attach a pipe-cleaner eyebrow to each servo arm.','Wire the servos to pins 9 and 10 and the buttons to pins 2 and 3.','Write code: one button tilts the eyebrows up (happy), the other tilts them down (grumpy).','Ask a friend to guess the feeling.'],
     safety:'Ask an adult to check the wiring before plugging in.', tryit:'Add a third feeling, like surprised, with both eyebrows high.'},
    {id:'pepper', name:'Pepper', aka:['pepper','softbank robot','greeting robot','waving robot'], who:'SoftBank Robotics', when:'introduced in 2014', kind:'Home and pets',
     real:'Pepper is a friendly humanoid robot with a tablet on its chest. It greeted people in shops, banks and hospitals and could recognise faces and voices.',
     mini:'Robot that waves when you walk up to it', level:'Intermediate', time:'An afternoon', code:true,
     parts:['Arduino Uno and USB cable','Ultrasonic distance sensor (HC-SR04)','1 micro servo (SG90)','Cardboard robot body','Jumper wires'],
     steps:['Build a cardboard robot and cut holes for the sensor’s two “eyes”.','Fix the servo at the shoulder and attach a cardboard arm.','Wire the sensor (trigger to pin 7, echo to pin 8) and the servo to pin 9.','Write code: when something is closer than 50 cm, wave the arm.','Walk up to it and say hello.'],
     safety:'Ask an adult to check the wiring before plugging in.', tryit:'Make it wave faster the closer you get.'},
    {id:'waymo', name:'Waymo', aka:['self driving car','self-driving car','robotaxi','google car','driverless car'], who:'Waymo (started at Google)', when:'driverless rides since 2020', kind:'Cars and delivery',
     real:'Waymo cars drive themselves with no one at the wheel, using cameras, radar and laser sensors (lidar) to see the road. They give taxi rides in several US cities.',
     mini:'Car that follows a flashlight', level:'Advanced', time:'A weekend', code:true,
     parts:['A two-motor robot car base (the track follower kit works)','Arduino Uno and a motor driver','2 light sensor modules','Jumper wires','A flashlight'],
     steps:['Mount one light sensor at the front left and one at the front right, pointing forward.','Wire the sensors to A0 and A1 and the motors through the driver.','Write code: read both sensors; if the left is brighter, turn left; if the right is brighter, turn right; if equal, go straight.','Dim the room and shine the flashlight ahead of the car.','Lead it around a chair.'],
     safety:'Take the batteries out when you change wiring.', tryit:'Flip the rule so it runs away from light, like a shy bug.'},
    {id:'starship', name:'Starship delivery robot', aka:['starship','delivery robot','food delivery robot','sidewalk robot'], who:'Starship Technologies', when:'delivering since 2018', kind:'Cars and delivery',
     real:'Starship robots are six-wheeled boxes that drive on sidewalks to deliver food and groceries. The lid stays locked until the person who ordered unlocks it with a phone.',
     mini:'Secret-code delivery box', level:'Intermediate', time:'An afternoon', code:true,
     parts:['Arduino Uno and USB cable','1 micro servo (SG90) as the lock','3 push buttons','A small box with a lid','Jumper wires'],
     steps:['Fix the servo inside the box so its arm can block the lid from opening.','Put the three buttons on the outside of the box.','Wire the buttons to pins 2, 3 and 4 and the servo to pin 9.','Write code: if the buttons are pressed in your secret order, turn the servo to unlock.','Hide a snack inside and challenge someone to crack the code.'],
     safety:'Keep a way to open the box if the code goes wrong (leave a small hole to push the arm).', tryit:'Add a buzzer that beeps when the wrong code is entered.'},
    {id:'boaty', name:'Boaty McBoatface', aka:['boaty','submarine','underwater robot','sub'], who:'UK National Oceanography Centre', when:'named in 2016', kind:'Ocean',
     real:'Boaty McBoatface is a robot submarine that travels deep under the ocean on its own to measure water temperature and currents. Its name came from a public vote.',
     mini:'Diving submarine in a bottle', level:'Beginner', time:'20 minutes', code:false,
     parts:['A 1–2 litre plastic bottle with cap','A ketchup packet or a pipette with a small nut as weight','Water'],
     steps:['Fill the bottle with water almost to the top.','Test the ketchup packet (or weighted pipette) in a glass of water: it should just barely float.','Put it in the bottle and close the cap tightly.','Squeeze the bottle: the sub sinks. Let go: it rises.','Try to make it hover in the middle.'],
     safety:'Work over a sink or outside.', tryit:'Underwater robots like Boaty have to control sinking and floating too. Can you park your sub at the bottom?'},
    {id:'davinci', name:'da Vinci surgical robot', aka:['da vinci','surgery robot','surgical robot','doctor robot'], who:'Intuitive Surgical', when:'approved for surgery in 2000', kind:'Factory and hospital',
     real:'The da Vinci system lets a surgeon operate through tiny cuts. The surgeon sits at a console and moves controls; the robot copies the moves with tiny, very steady tools.',
     mini:'Steady-hand buzz game', level:'Beginner', time:'1 hour', code:false,
     parts:['Thick bare craft wire (aluminium or copper, about 1 m)','2 × AA battery holder with batteries','A buzzer (3 V)','Insulated wire','A lump of modelling clay or a box for the base','Tape'],
     steps:['Bend the long wire into a wiggly path and stand its ends in the base.','Make a small loop wand from more wire and thread it onto the path before fixing the second end.','Connect the battery to the path, and the buzzer between the battery and the wand.','Tape over the two ends of the path as safe resting spots.','Move the wand along without touching. If they touch, it buzzes.'],
     safety:'Only use a small battery pack (3 V). Never connect it to a wall socket.', tryit:'Make the path harder and time yourself, like a surgeon in training.'},
    {id:'shakey', name:'Shakey', aka:['shakey','first mobile robot','sri robot'], who:'SRI (Stanford Research Institute)', when:'built from 1966 to 1972', kind:'History',
     real:'Shakey was the first mobile robot that could plan its own moves: look at a room, decide on a route and push boxes around. It shook as it moved, which gave it its name.',
     mini:'Program-a-robot card game (no electronics)', level:'Beginner', time:'30 minutes', code:false,
     parts:['Paper and markers to make arrow cards (forward, turn left, turn right)','Tape to mark a grid on the floor','A friend to be the robot','A “box” to push (a pillow)'],
     steps:['Tape a grid of squares on the floor and put the pillow in one square.','Make cards: forward one square, turn left, turn right, push.','Write a program: lay the cards in order.','Your friend is the robot: they follow the cards exactly, nothing else.','If the robot ends up in the wrong place, find the bug and fix your cards.'],
     safety:'Clear the floor so the “robot” doesn’t trip.', tryit:'Add a wall. Can you plan a route around it before the robot moves, like Shakey did?'},
    {id:'elektro', name:'Elektro', aka:['elektro','westinghouse robot','1939 robot','talking robot'], who:'Westinghouse', when:'shown at the 1939 New York World’s Fair', kind:'History',
     real:'Elektro was a 2-metre-tall robot that could walk slowly, move its arms and say about 700 words using a record player inside its body.',
     mini:'Talking cardboard robot', level:'Beginner', time:'1–2 hours', code:false,
     parts:['A recordable sound module (greeting-card style, with a button)','A cardboard box for the body and a small box for the head','Bottle caps, foil and markers to decorate','Tape and glue'],
     steps:['Build the body and head from boxes.','Record a message on the sound module, like “Hello, I am your robot.”','Fix the module inside the chest with the button poking through.','Decorate with caps and foil.','Press the chest button to make it talk.'],
     safety:'Keep the small module batteries away from little kids.', tryit:'Record a joke and test it on your family.'},
    {id:'sphero', name:'Sphero', aka:['sphero','robot ball','rolling robot','bb8','bb-8'], who:'Sphero', when:'first sold in 2011', kind:'Home and pets',
     real:'Sphero is a robot ball you drive from a phone. Inside, a little cart with wheels and a weight rolls the ball from the inside.',
     mini:'Rolling ball robot', level:'Intermediate', time:'1–2 hours', code:false,
     parts:['A clear plastic ball that opens in half (craft fill-able ball, about 10 cm)','1 small gear motor','2 × AA battery holder with switch','Hot glue'],
     steps:['Glue the motor’s shaft to the middle of one half of the ball, from the inside.','Glue the battery holder under the motor so it hangs down as a heavy weight.','Wire the battery holder to the motor.','Switch on and close the ball.','Put it on the floor: the motor turns the shell around the hanging weight and the ball rolls.'],
     safety:'Hot glue: adult help.', tryit:'Add more weight to the battery pack. Does it roll faster or slower?'}
  ];

  const STOP = new Set(['a','an','the','robot','robots','bot','build','make','mini','how','to','i','want','my','me','of','one','version','like']);
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const words = s => norm(s).split(' ').filter(w => w && !STOP.has(w));
  // Small typo tolerance ("perserverance", "asmio"), only for longer words that match nothing as typed.
  const near = (a, b) => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 2 || Math.min(a.length, b.length) < 5) return false;
    const d = Array.from({length: a.length + 1}, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[a.length][b.length] <= (Math.min(a.length, b.length) >= 7 ? 2 : 1);
  };
  for (const r of ROBOTS) {
    r.names = [r.name, ...r.aka].map(norm);
    r.vocab = [...new Set(words([r.name, ...r.aka, r.who, r.kind].join(' ')))];
  }
  const known = w => ROBOTS.some(r => r.vocab.some(v => v === w || v.startsWith(w) && w.length >= 3));
  function search(query) {
    const q = norm(query), qw = words(query);
    if (!q) return [];
    return ROBOTS.map(r => {
      let score = 0;
      if (r.names.includes(q)) score = 100;
      else if (r.names.some(n => n.includes(q) && q.length >= 3)) score = 70;
      else if (qw.length) {
        const hits = qw.filter(w => r.vocab.some(v => v === w || v.startsWith(w) && w.length >= 3 || !known(w) && near(w, v))).length;
        score = hits === qw.length ? 50 : hits ? 15 * hits : 0;
      }
      return {r, score};
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  }

  let current = null;
  const out = $('h-result');
  function book(r) {
    current = r;
    out.innerHTML = `<article id="h-book" class="h-book">
      <div class="h-cover"><span class="h-kind">${esc(r.kind)}</span><h3>Build a mini ${esc(r.name)}</h3><p class="h-mini">${esc(r.mini)}</p>
      <div class="guide-meta"><span>${esc(r.level)}</span><span>${esc(r.time)}</span><span>${r.code ? 'Coding needed' : 'No coding needed'}</span></div></div>
      <div class="h-real"><h4>The real ${esc(r.name)}</h4><p>${esc(r.real)}</p><p class="tiny">Made by ${esc(r.who)}, ${esc(r.when)}.</p></div>
      <div class="h-cols"><div class="h-parts"><h4>What you need</h4><ul>${r.parts.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
      <div><h4>How to build it</h4><ol class="h-steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${r.code ? '<p class="tiny">This build needs a short Arduino program. The helper will write it with you in a later version.</p>' : ''}</div></div>
      <p class="h-safe"><b>Stay safe:</b> ${esc(r.safety)}</p>
      <p class="h-try"><b>Cool thing to try:</b> ${esc(r.tryit)}</p>
      <div class="h-actions"><button type="button" class="primary" id="h-print">Print my book</button><button type="button" class="secondary" id="h-save">Save my book</button></div>
    </article>`;
  }
  function show(query) {
    const found = search(query);
    const chips = list => list.map(x => `<button type="button" class="h-chip" data-h="${x.r.id}">${esc(x.r.name)}</button>`).join('');
    if (found.length && found[0].score >= 50) {
      book(found[0].r);
      const others = found.slice(1).filter(x => x.score >= 50);
      if (others.length) out.insertAdjacentHTML('afterbegin', `<p class="h-also">Also matches: ${chips(others)}</p>`);
      $('h-status').textContent = `Here’s your instruction book for ${found[0].r.name}.`;
    } else {
      current = null;
      out.innerHTML = `<div class="h-miss"><h3>We don’t have that robot yet</h3><p>The Robot Helper knows 20 famous robots so far, and “${esc(query.trim())}” isn’t one of them. We’ll make it better!</p>
        ${found.length ? `<p>Did you mean: ${chips(found.slice(0, 3))}</p>` : ''}<p>Pick one of the 20 below, or <a href="#feedback">tell us which robot to add</a>.</p></div>`;
      $('h-status').textContent = 'That robot isn’t in the library yet.';
    }
    out.hidden = false;
    out.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  function pick(id) {
    const r = ROBOTS.find(x => x.id === id);
    $('h-search').value = r.name;
    show(r.name);
  }

  $('h-all').innerHTML = ROBOTS.map(r => `<button type="button" class="h-chip" data-h="${r.id}">${esc(r.name)}</button>`).join('');
  $('h-count').textContent = ROBOTS.length;
  form.addEventListener('submit', e => { e.preventDefault(); if ($('h-search').value.trim()) show($('h-search').value); $('h-search').blur(); });
  $('helper').addEventListener('click', e => {
    const chip = e.target.closest('[data-h]');
    if (chip) return pick(chip.dataset.h);
    if (!current) return;
    if (e.target.closest('#h-print')) {
      document.body.classList.add('printing-book');
      addEventListener('afterprint', () => document.body.classList.remove('printing-book'), {once: true});
      print();
    } else if (e.target.closest('#h-save')) {
      const r = current;
      download([`Build a mini ${r.name}: ${r.mini}`, `${r.level} · ${r.time} · ${r.code ? 'Coding needed' : 'No coding needed'}`, '',
        `The real ${r.name}`, r.real, `Made by ${r.who}, ${r.when}.`, '', 'What you need', ...r.parts.map(p => '- ' + p), '',
        'How to build it', ...r.steps.map((s, i) => `${i + 1}. ${s}`), '', 'Stay safe: ' + r.safety, 'Cool thing to try: ' + r.tryit, '',
        'From RobotLab: https://mdenolle.github.io/robotlab/'].join('\n'), `robotlab-${r.id}-book.txt`);
    }
  });
})();
