import { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, SkipForward, BookOpen, Shuffle } from 'lucide-react';

const INITIAL_PROMPTS = [
  {
    question: "What is a personality trait of yours that has helped you in a crisis?",
    hint: "Think about traits like 'stubbornness,' 'calmness,' or 'dark humor.'"
  },
  {
    question: "What part of your body do you often overlook but are grateful for today?",
    hint: "Think of your 'unsung heroes' like your liver, your pinky toe for balance, or your ears."
  },
  {
    question: "What is a habit you’ve built that you’re proud of?",
    hint: "Even 'drinking one glass of water in the morning' counts as a win."
  },
  {
    question: "What is a piece of advice you’re glad you didn’t take?",
    hint: "Reflect on a time your intuition saved you from a path that wasn't right for you."
  },
  {
    question: "What is something you’ve forgiven yourself for recently?",
    hint: "Focus on the lightness you feel now that you've let go of that guilt."
  },
  {
    question: "What is a 'win' from your childhood that still makes you smile?",
    hint: "Think of a spelling bee, a sports goal, or a brave moment on the playground."
  },
  {
    question: "What is a fear you’ve conquered, no matter how small?",
    hint: "Did you make a difficult phone call? Kill a spider? Acknowledge the courage."
  },
  {
    question: "How has your taste in music or art evolved in a way you appreciate?",
    hint: "Be glad for your current ability to find beauty in things you used to ignore."
  },
  {
    question: "What is a boundary you set recently that made you feel safe?",
    hint: "Thank yourself for saying 'no' to something that would have drained you."
  },
  {
    question: "What is a 'flaw' you have that actually has a secret benefit?",
    hint: "For example, 'being over-sensitive' often means you are highly empathetic."
  },
  {
    question: "What is the most useful thing you’ve learned this year?",
    hint: "Focus on how this knowledge gives you more agency in your life."
  },
  {
    question: "What is a compliment you received that you actually believed?",
    hint: "Reflect on why that specific compliment resonated with your soul."
  },
  {
    question: "What is something you’re 'better at' than you were a year ago?",
    hint: "Notice the gradual growth that usually goes invisible."
  },
  {
    question: "What is your favorite way to spend time alone?",
    hint: "Be grateful for the comfort you find in your own company."
  },
  {
    question: "What is a dream you have for the future that gives you hope?",
    hint: "The ability to imagine a better future is a gift in itself."
  },
  {
    question: "What is a 'guilty pleasure' that you’ve stopped feeling guilty about?",
    hint: "Whether it's reality TV or a specific snack, appreciate the pure joy it brings."
  },
  {
    question: "What is a physical sensation you love feeling?",
    hint: "Think of sun on your skin, a hot shower, or the feeling of fresh grass."
  },
  {
    question: "What is a book or quote that changed how you see yourself?",
    hint: "Identify the specific sentence that made you feel 'seen.'"
  },
  {
    question: "What is one thing you did today just because it made you happy?",
    hint: "Acknowledge the act of self-kindness, no matter how brief."
  },
  {
    question: "Who is a 'background character' in your life you appreciate?",
    hint: "Think of the barista who knows your order or the person who cleans your office."
  },
  {
    question: "What is a joke that always makes you laugh, no matter how many times you hear it?",
    hint: "Be grateful for the friend who told it to you or the memory of that laughter."
  },
  {
    question: "Who is a teacher or mentor who believed in you when you didn't?",
    hint: "Reflect on how their belief changed your trajectory."
  },
  {
    question: "What is a specific thing a friend did recently that made you feel loved?",
    hint: "Focus on the 'little' things, like a check-in text or a shared meme."
  },
  {
    question: "What is a family tradition (born or chosen) that you cherish?",
    hint: "Describe the feeling of belonging that comes with this tradition."
  },
  {
    question: "Who is someone you can be your 'weirdest' self around?",
    hint: "Appreciate the freedom of not having to perform or mask."
  },
  {
    question: "What is a lesson a child or pet taught you recently?",
    hint: "They often teach us about presence, play, or unconditional love."
  },
  {
    question: "Who is a historical figure you’re grateful for?",
    hint: "Think of someone whose bravery or invention paved the way for your life."
  },
  {
    question: "What is a 'hard conversation' you had that actually improved a relationship?",
    hint: "Be grateful for the honesty and the bridge it built."
  },
  {
    question: "What is something you admire about your 'worst' enemy or a difficult person?",
    hint: "This is a master-level gratitude exercise. Find one neutral strength they have."
  },
  {
    question: "Who is the person in your life who always tells you the truth?",
    hint: "Be grateful for their honesty, even when it’s hard to hear."
  },
  {
    question: "What is a piece of art or music that makes you feel connected to humanity?",
    hint: "Reflect on the fact that someone else felt what you feel and made something from it."
  },
  {
    question: "Who is the most reliable person you know?",
    hint: "Think about the peace of mind their consistency gives you."
  },
  {
    question: "What is a random act of kindness you witnessed recently?",
    hint: "Focus on the feeling that the world is a kinder place than we think."
  },
  {
    question: "What is a quality in your partner or best friend that balances you out?",
    hint: "If you're a worrier, are they a 'grounder'?"
  },
  {
    question: "Who is someone you’ve lost who still influences you for the better?",
    hint: "Be grateful for the 'ghost' of their wisdom."
  },
  {
    question: "What is a 'small talk' moment that actually felt quite nice today?",
    hint: "Maybe it was a smile from a stranger or a quick laugh with a cashier."
  },
  {
    question: "Who is someone you can call at 2:00 AM?",
    hint: "Acknowledge the safety net that person provides."
  },
  {
    question: "What is a way that someone has surprised you for the better lately?",
    hint: "People can be more thoughtful than we give them credit for."
  },
  {
    question: "What is a 'thank you' you forgot to say but can feel now?",
    hint: "Write the 'thank you' here as if they are listening."
  },
  {
    question: "What is something in your fridge right now that you’re excited to eat?",
    hint: "Describe the flavor or the comfort it will provide."
  },
  {
    question: "What is your favorite 'cozy corner' in your home?",
    hint: "Why does this specific spot make you feel safe?"
  },
  {
    question: "What is a smell that instantly takes you to a happy place?",
    hint: "Think of rain on pavement, old books, or a specific perfume."
  },
  {
    question: "What is a piece of clothing that makes you feel like 'you'?",
    hint: "Focus on the confidence or comfort it provides."
  },
  {
    question: "What is a sound in nature that you find incredibly soothing?",
    hint: "Is it the wind in the trees, a rushing river, or birds at dawn?"
  },
  {
    question: "What is a luxury you have that you often take for granted?",
    hint: "Think of things like high-speed internet, hot water, or a soft pillow."
  },
  {
    question: "What is something beautiful you saw on your way to work or the store?",
    hint: "Look for the 'glimmers'—a flower in a sidewalk crack or a sunset."
  },
  {
    question: "What is your favorite time of day for lighting?",
    hint: "Is it 'golden hour,' or the blue light of dusk?"
  },
  {
    question: "What is an invention in your kitchen that you couldn't live without?",
    hint: "Think of the humble toaster, the microwave, or a sharp knife."
  },
  {
    question: "What is a plant or tree near you that you’ve noticed changing with the seasons?",
    hint: "Appreciate the steady, quiet rhythm of nature."
  },
  {
    question: "What is a texture you love to touch?",
    hint: "Think of velvet, smooth stones, or a pet’s fur."
  },
  {
    question: "What is a 'cheap' item you bought that has brought you massive joy?",
    hint: "A specific pen? A $1 plant? A funky mug?"
  },
  {
    question: "What is your favorite thing about the city or town you live in?",
    hint: "Think of a specific park, a library, or just the 'vibe.'"
  },
  {
    question: "What is a color you’ve been drawn to lately?",
    hint: "How does looking at this color make you feel?"
  },
  {
    question: "What is something in your environment that reminds you of a goal you reached?",
    hint: "A diploma, a trophy, or even a messy craft project."
  },
  {
    question: "What is a 'view' you have access to that never gets old?",
    hint: "Even if it’s just the view from your bedroom window."
  },
  {
    question: "What is a specific 'modern convenience' you are glad exists?",
    hint: "GPS? Air conditioning? Music streaming?"
  },
  {
    question: "What is something you use every day that was a gift?",
    hint: "Reflect on the person who gave it to you and their intent."
  },
  {
    question: "What is a song that makes you want to dance, even if you’re alone?",
    hint: "Be grateful for the physical impulse to move."
  },
  {
    question: "What is the most comfortable thing you own?",
    hint: "Describe the feeling of sinking into it at the end of a long day."
  },
  // Category 4: Hardships & Reframing
  {
    question: "What is a 'closed door' you are now glad you didn't walk through?",
    hint: "Think of a job you didn't get or a relationship that ended."
  },
  {
    question: "What is a struggle you had today that made you stronger?",
    hint: "Focus on the 'muscle' you built, like patience or resilience."
  },
  {
    question: "What is a 'mistake' you made that led to a surprising discovery?",
    hint: "Think of 'happy accidents' in cooking, work, or travel."
  },
  {
    question: "What is a boring task you do that actually provides you with stability?",
    hint: "Doing the laundry means you have clean clothes; be grateful for the 'system.'"
  },
  {
    question: "What is something you’ve lost that taught you the value of what you have?",
    hint: "Focus on the clarity that came after the loss."
  },
  {
    question: "What is a difficult emotion you felt today that you allowed yourself to feel?",
    hint: "Be grateful for your capacity to be honest with yourself."
  },
  {
    question: "What is a 'disaster' from your past that you can now laugh about?",
    hint: "Time plus tragedy equals comedy—be glad for the 'time' part."
  },
  {
    question: "What is a criticism you received that actually helped you grow?",
    hint: "Reframe the sting of the critique into the value of the growth."
  },
  {
    question: "What is something you are 'over' or 'done with' that used to bother you?",
    hint: "Be grateful for the emotional maturity of outgrowing a petty worry."
  },
  {
    question: "What is a 'hard' person in your life who has forced you to develop boundaries?",
    hint: "They are your 'boundary trainer'—be grateful for the skill they forced you to learn."
  },
  {
    question: "What is a time you felt 'at the bottom' and how did the climb up feel?",
    hint: "Appreciate your own 'bounce back' factor."
  },
  {
    question: "What is a physical scar you have and the story of survival it tells?",
    hint: "See it as a badge of experience rather than a blemish."
  },
  {
    question: "What is a 'rainy day' (literal or figurative) that allowed you to rest?",
    hint: "Be grateful for the permission to stop that the 'bad weather' gave you."
  },
  {
    question: "What is a doubt you had about yourself that you proved wrong?",
    hint: "Celebrate the 'I told you so' you gave to your inner critic."
  },
  {
    question: "What is a resource (money, time, help) that showed up just when you needed it?",
    hint: "Reflect on the feeling of 'just-in-time' support."
  },
  {
    question: "What is a 'no' that eventually led to a better 'yes'?",
    hint: "Trace the path from a disappointment to a current success."
  },
  {
    question: "What is something you’ve survived that you never thought you could?",
    hint: "Sit with the power of your own endurance."
  },
  {
    question: "What is a health scare or injury that made you appreciate your body more?",
    hint: "Focus on the relief of recovery or the lessons of the limitation."
  },
  {
    question: "What is a mess in your life right now that proves you are 'living'?",
    hint: "A messy kitchen means you ate; a messy desk means you worked."
  },
  {
    question: "What is a silence that was actually peaceful rather than lonely?",
    hint: "Distinguish between the two and appreciate the calm."
  },
  // Category 5: Modern Life & Small Miracles
  {
    question: "What is a piece of news you read today that was actually positive?",
    hint: "Seek out the 'good news' stories to balance the noise."
  },
  {
    question: "What is a 'synchronicity' or coincidence that happened lately?",
    hint: "Did you think of someone and then they called? Appreciate the mystery."
  },
  {
    question: "What is your favorite thing about the internet?",
    hint: "Focus on the access to information, memes, or connecting with loved ones."
  },
  {
    question: "What is a 'future invention' you are excited to see in your lifetime?",
    hint: "Be grateful for the era of rapid innovation we live in."
  },
  {
    question: "What is a holiday or celebration you’re looking forward to?",
    hint: "Enjoy the 'pre-gratitude' of the anticipation."
  },
  {
    question: "What is a specific animal you think is amazing?",
    hint: "Think of the complexity of a bee, the grace of a cat, or the vastness of a whale."
  },
  {
    question: "What is a 'made-up' holiday you want to celebrate (e.g., 'Self-Care Sunday')?",
    hint: "Be grateful for the agency to create your own joy."
  },
  {
    question: "What is something you can afford now that you couldn't five years ago?",
    hint: "Even if it's just 'the name-brand cereal.'"
  },
  {
    question: "What is a hobby you have that makes time disappear?",
    hint: "Be grateful for the state of 'flow.'"
  },
  {
    question: "What is a movie you’ve seen more than five times?",
    hint: "Why does it feel like 'home' to you?"
  },
  {
    question: "What is a smell in a grocery store that you love?",
    hint: "The bakery? The produce section? The coffee aisle?"
  },
  {
    question: "What is a 'small win' you had in traffic or transit today?",
    hint: "Getting all green lights or finding a seat on the train."
  },
  {
    question: "What is a podcast or YouTuber who makes you feel smarter?",
    hint: "Appreciate the free education available at your fingertips."
  },
  {
    question: "What is a way you’ve been able to help someone else lately?",
    hint: "Being useful to others is one of the greatest feelings; be grateful for the chance."
  },
  {
    question: "What is something you’re wearing right now that feels soft?",
    hint: "Focus entirely on the tactile comfort."
  },
  {
    question: "What is a 'secret' you have that makes you smile?",
    hint: "A surprise you're planning or a personal goal you're working on."
  },
  {
    question: "What is a weather pattern you find beautiful (even if others don't)?",
    hint: "Fog? Thunderstorms? Overcast skies?"
  },
  {
    question: "What is a way you’ve simplified your life recently?",
    hint: "Be grateful for the 'less' that gives you 'more.'"
  },
  {
    question: "What is a dream you had last night that was interesting or pleasant?",
    hint: "Be grateful for your brain's nighttime 'cinema.'"
  },
  {
    question: "What is the very best thing about being you today?",
    hint: "Don't be humble. Identify one thing that makes your specific life worth living right now."
  },
  {
    question: "Which of these categories do you think will be the hardest for you to answer honestly?",
    hint: "Acknowledge the challenge and commit to the journey."
  },
  // Part 1: The Personal Self & Growth (1–80)
  {
    question: "A skill you practiced today?",
    hint: "Even if you just practiced patience while waiting for coffee."
  },
  {
    question: "A boundary you successfully held?",
    hint: "Think of a time you said 'no' to protect your peace."
  },
  {
    question: "A 'flaw' that actually serves you?",
    hint: "Your 'stubbornness' might actually be 'persistence.'"
  },
  {
    question: "A goal you reached five years ago?",
    hint: "Remember when you were desperate to be where you are now."
  },
  {
    question: "A piece of advice you’re glad you ignored?",
    hint: "Thank your intuition for steering you away from a bad path."
  },
  {
    question: "A habit you’ve finally broken?",
    hint: "Feel the lightness of no longer being tied to that routine."
  },
  {
    question: "A part of your body that feels strong?",
    hint: "Focus on what that body part allows you to do (run, hold, carry)."
  },
  {
    question: "A fear you’ve faced?",
    hint: "Acknowledge the courage it took to do it anyway."
  },
  {
    question: "Your favorite quirk about yourself?",
    hint: "What makes you 'weird' usually makes you memorable."
  },
  {
    question: "A decision you made that changed everything?",
    hint: "Trace the positive ripple effects of that single choice."
  },
  {
    question: "Something you’ve forgiven yourself for?",
    hint: "Feel the space in your heart now that the guilt is gone."
  },
  {
    question: "A talent you often take for granted?",
    hint: "Not everyone can cook, sing, or organize like you."
  },
  {
    question: "Your favorite way to spend a solo hour?",
    hint: "Be grateful for the comfort you find in your own company."
  },
  {
    question: "A 'small win' you had this morning?",
    hint: "Did you wake up on time? Did you make a great breakfast?"
  },
  {
    question: "A compliment you received recently?",
    hint: "Why did it feel particularly good to hear?"
  },
  {
    question: "Your ability to learn?",
    hint: "Think of a complex topic you eventually understood."
  },
  {
    question: "A personality trait you inherited?",
    hint: "Which 'good' part of your parents lives on in you?"
  },
  {
    question: "The way you handle stress better now?",
    hint: "Compare your current self to your 'younger, reactive' self."
  },
  {
    question: "A dream you still have for the future?",
    hint: "Be grateful for the capacity to hope and plan."
  },
  {
    question: "A time you stood up for yourself?",
    hint: "Acknowledge the 'inner guardian' that protected you."
  },
  {
    question: "Your favorite physical feature?",
    hint: "Focus on the character in your face, like your eyes or smile."
  },
  {
    question: "A recent 'aha!' moment?",
    hint: "That flash of clarity is a gift from your brain."
  },
  {
    question: "The way you show love to others?",
    hint: "Be proud of the specific way you make people feel safe."
  },
  {
    question: "A time you were the bigger person?",
    hint: "It takes energy to choose peace over being right."
  },
  {
    question: "Your favorite outfit?",
    hint: "How does it change your confidence when you wear it?"
  },
  {
    question: "A difficult emotion you allowed yourself to feel?",
    hint: "Honesty with oneself is a high form of growth."
  },
  {
    question: "A recent investment you made in yourself?",
    hint: "Did you buy a book, a course, or a gym membership?"
  },
  {
    question: "Your sense of humor?",
    hint: "When was the last time you made yourself laugh?"
  },
  {
    question: "A risk you took that didn't work out, but taught you something?",
    hint: "The lesson is the treasure."
  },
  {
    question: "Your favorite childhood toy?",
    hint: "Recall the pure joy it brought to your younger self."
  },
  {
    question: "The feeling of being 'done' with a task?",
    hint: "Focus on the mental click of completion."
  },
  {
    question: "A secret you keep that makes you happy?",
    hint: "Some joys are better when they are private."
  },
  {
    question: "The fact that you are literate?",
    hint: "Imagine how limited your world would be without reading."
  },
  {
    question: "Your favorite childhood teacher?",
    hint: "How did their belief in you change your life?"
  },
  {
    question: "The way you’ve simplified your life recently?",
    hint: "Less clutter equals more mental space."
  },
  {
    question: "A time you asked for help?",
    hint: "Be grateful for the humility it took to reach out."
  },
  {
    question: "Your favorite way to rest?",
    hint: "Whether it's a nap or a movie, appreciate the recharge."
  },
  {
    question: "A 'mystery' about yourself?",
    hint: "Be glad you still have layers to discover."
  },
  {
    question: "The feeling of fresh laundry?",
    hint: "Describe the scent and the crispness."
  },
  {
    question: "Your resilience?",
    hint: "Think of a day you didn't think you'd survive, but you did."
  },
  {
    question: "A skill you're currently learning?",
    hint: "Be grateful for the 'frustration phase' of growth."
  },
  {
    question: "Your favorite ritual?",
    hint: "Morning coffee, evening stretch, or Sunday cleaning."
  },
  {
    question: "A time you were brave in silence?",
    hint: "Not all courage requires a roar."
  },
  {
    question: "The way you’ve learned to say 'no'?",
    hint: "That 'no' is a 'yes' to your own health."
  },
  {
    question: "Your favorite scent on your own skin?",
    hint: "Is it your perfume, or just the scent of being clean?"
  },
  {
    question: "A mistake you made that ended up being funny?",
    hint: "Be glad for the 'comic relief' of your own life."
  },
  {
    question: "Your capacity for empathy?",
    hint: "How does it feel to truly understand someone else?"
  },
  {
    question: "A recent physical health win?",
    hint: "Even if it's just 'my headache went away.'"
  },
  {
    question: "Your favorite memory from last summer?",
    hint: "Try to feel the warmth of that day right now."
  },
  {
    question: "The person you were 10 years ago?",
    hint: "Thank them for doing the work so you could be here."
  },
  {
    question: "A specific 'gut feeling' that was right?",
    hint: "Thank your body for its internal compass."
  },
  {
    question: "A time you changed your mind?",
    hint: "Flexibility is a sign of intelligence."
  },
  {
    question: "Your favorite way to move your body?",
    hint: "Dancing, walking, lifting—feel the strength."
  },
  {
    question: "A piece of art you created?",
    hint: "Even a doodle or a well-plated meal counts."
  },
  {
    question: "The way you handle 'bad news' better now?",
    hint: "Appreciate your emotional maturity."
  },
  {
    question: "A time you felt completely at peace?",
    hint: "Re-live that stillness for a moment."
  },
  {
    question: "Your favorite 'home-cooked' meal?",
    hint: "Be grateful for the skill to feed yourself."
  },
  {
    question: "A time you were a good friend?",
    hint: "Acknowledge the support you provided to someone else."
  },
  {
    question: "Your favorite time of day?",
    hint: "Is it the quiet of 5 AM or the buzz of noon?"
  },
  {
    question: "A question you stopped asking yourself?",
    hint: "Be glad you’ve found the answer or stopped caring."
  },
  {
    question: "Your favorite thing about your job?",
    hint: "Focus on the one task you actually enjoy."
  },
  {
    question: "A time you felt 'seen' by a stranger?",
    hint: "Acknowledge that brief moment of human connection."
  },
  {
    question: "Your favorite place to think?",
    hint: "A park bench, the shower, or a specific chair."
  },
  {
    question: "A 'luck' moment you had recently?",
    hint: "Did you catch the green light or find a $5 bill?"
  },
  {
    question: "Your favorite song as a teenager?",
    hint: "Be grateful for the person you were when you loved it."
  },
  {
    question: "A time you were productive when you didn't feel like it?",
    hint: "Thank your discipline."
  },
  {
    question: "Your favorite way to organize your thoughts?",
    hint: "Journaling, lists, or talking it out."
  },
  {
    question: "A 'weird' hobby you love?",
    hint: "Be glad you have something that is just for you."
  },
  {
    question: "The feeling of being 'ready' for something?",
    hint: "Appreciate the preparation that led to the confidence."
  },
  {
    question: "A person you’ve outgrown?",
    hint: "Be grateful for the season they were in your life."
  },
  {
    question: "Your favorite physical sensation?",
    hint: "Wind on your face, sand in your toes, or a warm bath."
  },
  {
    question: "A time you kept a promise to yourself?",
    hint: "That is how you build self-trust."
  },
  {
    question: "The way you’ve learned to handle criticism?",
    hint: "Be glad you no longer take everything personally."
  },
  {
    question: "Your favorite 'brain game'?",
    hint: "Sudoku, Wordle, or a complex puzzle."
  },
  {
    question: "A time you made someone else smile?",
    hint: "Reflect on the 'glow' you felt afterward."
  },
  {
    question: "The feeling of a clean desk?",
    hint: "Focus on the mental clarity it provides."
  },
  {
    question: "Your favorite way to 'treat yourself'?",
    hint: "Acknowledge the importance of self-reward."
  },
  {
    question: "A time you chose 'done' over 'perfect'?",
    hint: "Be glad for the freedom of moving on."
  },
  {
    question: "Your favorite thing about your current age?",
    hint: "What do you know now that you didn't 10 years ago?"
  },
  {
    question: "The fact that you are curious?",
    hint: "Curiosity is the engine of a happy life."
  },
  // Part 2: People, Connection & Social Miracles (81–160)
  {
    question: "A person who makes you feel safe?",
    hint: "Describe the feeling of your guard dropping when they enter."
  },
  {
    question: "A 'regular' at a place you go who makes you smile?",
    hint: "The barista or the person at the dog park."
  },
  {
    question: "A person you haven't talked to in years who still inspires you?",
    hint: "Be glad for the 'footprint' they left."
  },
  {
    question: "The feeling of a shared glance with a stranger?",
    hint: "That 'did you see that?' moment is a human bond."
  },
  {
    question: "A person who always tells you the truth?",
    hint: "Be grateful for their honesty, even if it stings."
  },
  {
    question: "A 'service' person who did an amazing job?",
    hint: "The plumber, the mail carrier, or the tech support."
  },
  {
    question: "The person who taught you your favorite skill?",
    hint: "Write them a 'mental thank you' note."
  },
  {
    question: "A friend who knows your 'darkest' humor?",
    hint: "Be glad you don't have to filter yourself."
  },
  {
    question: "The feeling of someone holding the door for you?",
    hint: "Acknowledge the small act of social grace."
  },
  {
    question: "A person you can call at 2 AM?",
    hint: "Reflect on the 'safety net' they provide."
  },
  {
    question: "A neighbor who waves at you?",
    hint: "Be glad for the 'soft security' of a friendly street."
  },
  {
    question: "A person whose social media makes you feel better, not worse?",
    hint: "Thank them for their authenticity."
  },
  {
    question: "The way someone says your name?",
    hint: "There is a specific warmth in a familiar voice."
  },
  {
    question: "A person who has passed away but whose advice you still use?",
    hint: "Be glad their wisdom is permanent."
  },
  {
    question: "A coworker who makes the meeting bearable?",
    hint: "Be grateful for the 'shared eye roll.'"
  },
  {
    question: "The person who introduced you to your favorite hobby?",
    hint: "Trace back the joy to that one introduction."
  },
  {
    question: "A stranger who gave you a compliment today?",
    hint: "Be glad for the spontaneous kindness."
  },
  {
    question: "The feeling of 'coming home' to someone?",
    hint: "Not a place, but the person."
  },
  {
    question: "A person you were able to help recently?",
    hint: "Be grateful for the capacity to be useful."
  },
  {
    question: "A person who is your opposite but balances you out?",
    hint: "Be glad for the 'missing pieces' they provide."
  },
  {
    question: "The person who always likes your photos?",
    hint: "Acknowledge the small 'digital cheerleading.'"
  },
  {
    question: "A person whose laughter is contagious?",
    hint: "Try to hear it in your head right now."
  },
  {
    question: "A person who challenged your bias?",
    hint: "Be grateful for the growth that followed the discomfort."
  },
  {
    question: "The person who made you coffee or tea today?",
    hint: "Even if it was yourself—thank the 'you' that did it."
  },
  {
    question: "A person you just met who you 'clicked' with?",
    hint: "Be glad for the 'instant friendship' spark."
  },
  {
    question: "The person who recommended your favorite book?",
    hint: "Thank them for the new world they gave you."
  },
  {
    question: "A person who is a great listener?",
    hint: "Focus on how 'heard' they make you feel."
  },
  {
    question: "A person who is 'low maintenance' and easy to be with?",
    hint: "Be grateful for the lack of drama."
  },
  {
    question: "The person who cleans up after you (even if it's their job)?",
    hint: "Acknowledge the labor that makes your life easier."
  },
  {
    question: "A person you missed, and the joy of seeing them again?",
    hint: "Re-feel the 'reunion' hug."
  },
  {
    question: "The person who always has the best advice?",
    hint: "Be glad for their 'life data.'"
  },
  {
    question: "A person who made you feel brave?",
    hint: "How did their encouragement change your action?"
  },
  {
    question: "A person you work with who is incredibly competent?",
    hint: "Be glad they are on your team."
  },
  {
    question: "The person who keeps the family/friend group together?",
    hint: "Thank the 'organizer.'"
  },
  {
    question: "A person who forgave you when you didn't deserve it?",
    hint: "Be grateful for the second chance."
  },
  {
    question: "A person who is older than you and shows you what is possible?",
    hint: "Be glad for the 'future roadmap.'"
  },
  {
    question: "A person who is younger than you and keeps you curious?",
    hint: "Be glad for the 'fresh eyes.'"
  },
  {
    question: "The person who always knows what to say in a crisis?",
    hint: "Be grateful for their 'anchor' energy."
  },
  {
    question: "A person who sent you a 'just thinking of you' text?",
    hint: "Be glad you are in someone’s thoughts."
  },
  {
    question: "A person who 'gets' your niche references?",
    hint: "Be grateful for the shared shorthand."
  },
  {
    question: "A person who pushed you to do better?",
    hint: "Even if it was annoying at the time."
  },
  {
    question: "The person who defended you when you weren't there?",
    hint: "That is the highest form of loyalty."
  },
  {
    question: "A person who is a 'glimmer' in your day?",
    hint: "Someone who just radiates good energy."
  },
  {
    question: "A person who shares their food with you?",
    hint: "It's the ultimate 'tribe' gesture."
  },
  {
    question: "The person who taught you how to drive/cook/read?",
    hint: "Acknowledge the patience they had."
  },
  {
    question: "A person who is your 'intellectual crush'?",
    hint: "Be glad for the people who make you want to be smarter."
  },
  {
    question: "A person you haven't met yet but are excited to?",
    hint: "Be grateful for the 'infinite potential' of the future."
  },
  {
    question: "The person who always answers the group chat?",
    hint: "Thank the 'responder.'"
  },
  {
    question: "A person who is a great storyteller?",
    hint: "Be glad for the entertainment they provide."
  },
  {
    question: "A person who is calm when you are frantic?",
    hint: "Thank them for being your 'emotional regulator.'"
  },
  {
    question: "The person who knows your coffee order?",
    hint: "Be grateful for the feeling of being 'known.'"
  },
  {
    question: "A person who 'liked' your creative work?",
    hint: "Thank them for the validation."
  },
  {
    question: "A person you compete with in a healthy way?",
    hint: "Be glad they make you sharper."
  },
  {
    question: "The person who introduced you to your partner/best friend?",
    hint: "Thank the 'matchmaker.'"
  },
  {
    question: "A person who makes you feel like the best version of yourself?",
    hint: "Identify why they bring that out. "
  },
  {
    question: "A person who is a 'silent helper'?",
    hint: "Someone who does the chores without being asked."
  },
  {
    question: "The person who always has a snack/gum/tissue for you?",
    hint: "Thank the 'prepared' one."
  },
  {
    question: "A person who makes you feel attractive?",
    hint: "Be grateful for the boost in self-image."
  },
  {
    question: "A person who is a 'master' of their craft (chef, artist, carpenter)?",
    hint: "Be glad you get to witness excellence."
  },
  {
    question: "The person who stayed late to help you finish?",
    hint: "Thank them for their time."
  },
  {
    question: "A person who makes you rethink your perspective?",
    hint: "Be grateful for the mental expansion."
  },
  {
    question: "A person who is 'your person'?",
    hint: "Define what that specific connection means to you."
  },
  {
    question: "The person who always tells you about the best new things?",
    hint: "Thank the 'scout.'"
  },
  {
    question: "A person who is a 'gentle soul'?",
    hint: "Be grateful for the peace they bring to the room."
  },
  {
    question: "A person who is fiercely protective of you?",
    hint: "Be glad someone is 'in your corner.'"
  },
  {
    question: "The person who always asks 'How are you?' and means it?",
    hint: "Acknowledge the genuine care."
  },
  {
    question: "A person who is a 'clown' and makes you laugh until it hurts?",
    hint: "Laughter is medicine."
  },
  {
    question: "A person who makes you feel part of something bigger?",
    hint: "Be glad for the 'belonging.'"
  },
  {
    question: "The person who recommended this journal/practice to you?",
    hint: "Thank them for the tools."
  },
  {
    question: "A person who is simply 'there' for you?",
    hint: "Consistency is the quietest miracle."
  },
  {
    question: "The person who made you feel 'important' today?",
    hint: "Even if it was just a small gesture."
  },
  {
    question: "A person you admire from afar?",
    hint: "Be glad for the 'role models' in the world."
  },
  {
    question: "The person who sends you the best memes?",
    hint: "Thank them for the daily dopamine."
  },
  {
    question: "A person who is an expert at 'small talk'?",
    hint: "Be glad they carry the conversation."
  },
  {
    question: "The person who reminds you to take a break?",
    hint: "Thank them for looking out for your health."
  },
  {
    question: "A person who 'has a way' with animals/kids?",
    hint: "Be glad for their gentle nature."
  },
  {
    question: "The person who is always on time?",
    hint: "Thank them for respecting your time."
  },
  {
    question: "A person who is a 'dreamer' and inspires you?",
    hint: "Be glad for the vision they share."
  },
  {
    question: "The person who is a 'doer' and gets things moving?",
    hint: "Thank the engine."
  },
  {
    question: "Yourself?",
    hint: "Be grateful for the person who is doing this exercise right now."
  },
  // Part 3: The Physical World, Nature & Senses (161–240)
  {
    question: "The exact temperature of your shower?",
    hint: "Focus on the 'sweet spot' where it feels perfect."
  },
  {
    question: "The 'crunch' of an apple or chip?",
    hint: "Appreciate the auditory satisfaction of eating."
  },
  {
    question: "The smell of rain on hot pavement?",
    hint: "This is called 'Petrichor'—be glad for it."
  },
  {
    question: "The weight of a heavy blanket?",
    hint: "Focus on the 'hug' feeling it provides for your nervous system."
  },
  {
    question: "The sight of dust motes in a sunbeam?",
    hint: "Look for the magic in the air."
  },
  {
    question: "The feeling of fresh grass between your toes?",
    hint: "Focus on the 'grounding' connection to Earth."
  },
  {
    question: "The taste of perfectly cold water when you’re thirsty?",
    hint: "It's the most basic and vital pleasure."
  },
  {
    question: "The sound of 'white noise' (fan, rain, ocean)?",
    hint: "Be glad for the 'sonic blanket' that helps you sleep."
  },
  {
    question: "The visual of a sunset?",
    hint: "Notice the specific colors—is it 'peach' or 'fire'?"
  },
  {
    question: "The feeling of a 'big stretch' in the morning?",
    hint: "Feel the literal space opening up in your joints."
  },
  {
    question: "The scent of 'old books' or 'fresh paper'?",
    hint: "Be grateful for the 'smell of knowledge.'"
  },
  {
    question: "The feeling of being 'warm enough' in the cold?",
    hint: "Thank your coat or your heater."
  },
  {
    question: "The sound of a bird you don’t know the name of?",
    hint: "Be glad for the 'free music' of nature."
  },
  {
    question: "The sight of a 'glitch in the matrix' (something weird and funny)?",
    hint: "Look for the humor in the world."
  },
  {
    question: "The feeling of 'clean teeth' after the dentist?",
    hint: "Focus on the 'slick' feeling."
  },
  {
    question: "The smell of baking bread?",
    hint: "It’s the 'scent of home'—be glad for it."
  },
  {
    question: "The visual of a moon you can see during the day?",
    hint: "Be grateful for the 'cosmic surprise.'"
  },
  {
    question: "The feeling of your head hitting the pillow?",
    hint: "Focus on the 'instant release' of tension."
  },
  {
    question: "The sound of your own favorite song on a good speaker?",
    hint: "Feel the vibration in the air."
  },
  {
    question: "The taste of 'your' favorite spice (cinnamon, garlic, chili)?",
    hint: "Be glad for the 'flavor data.'"
  },
  {
    question: "The sight of a tree in your neighborhood?",
    hint: "Notice the 'life' it brings to the street."
  },
  {
    question: "The feeling of a hot towel on your face?",
    hint: "It’s a 'mini-spa' moment—be glad for it."
  },
  {
    question: "The smell of a specific person you love?",
    hint: "Scent is the strongest link to emotion."
  },
  {
    question: "The visual of 'organized' things (spice rack, library)?",
    hint: "Focus on the 'order' in the chaos."
  },
  {
    question: "The feeling of 'soft' clothes (cashmere, worn-in cotton)?",
    hint: "Focus on the 'gentle' touch."
  },
  {
    question: "The sound of a crackling fire?",
    hint: "It’s an 'ancient' comfort."
  },
  {
    question: "The taste of a fresh berry?",
    hint: "Be glad for the 'burst' of flavor."
  },
  {
    question: "The sight of stars in a dark sky?",
    hint: "Feel the 'perspective' they provide."
  },
  {
    question: "The feeling of 'gravity'?",
    hint: "Thank the Earth for holding onto you."
  },
  {
    question: "The smell of 'freshly cut grass'?",
    hint: "It’s the 'scent of summer.'"
  },
  {
    question: "The visual of a 'rainbow' in a soap bubble?",
    hint: "Look for the 'accidental' beauty."
  },
  {
    question: "The feeling of 'wind' pushing against you?",
    hint: "Feel the 'power' of the invisible."
  },
  {
    question: "The sound of 'leaf-crunching' in the fall?",
    hint: "It’s the 'audio of the seasons.'"
  },
  {
    question: "The taste of a 'hot meal' on a cold day?",
    hint: "Focus on the 'internal warmth.'"
  },
  {
    question: "The sight of a 'well-made' object (a watch, a chair)?",
    hint: "Be glad for human 'craftsmanship.'"
  },
  {
    question: "The feeling of 'water' on your skin (lake, pool, ocean)?",
    hint: "Feel the 'buoyancy.'"
  },
  {
    question: "The smell of 'coffee' before you drink it?",
    hint: "The 'anticipation' is a joy itself."
  },
  {
    question: "The visual of 'steam' rising from a cup?",
    hint: "It’s a 'temporary dance'—be glad for it."
  },
  {
    question: "The feeling of 'sun' on your face through a window?",
    hint: "It’s a 'filtered' blessing."
  },
  {
    question: "The sound of a 'distant train' or 'airplane'?",
    hint: "Be glad for the 'mystery' of where it's going."
  },
  {
    question: "The taste of 'dark chocolate'?",
    hint: "Focus on the 'bitter-sweet' balance."
  },
  {
    question: "The sight of 'moss' on a rock?",
    hint: "Be glad for the 'resilience' of tiny things."
  },
  {
    question: "The feeling of 'tired legs' after a long walk?",
    hint: "It’s 'earned' fatigue."
  },
  {
    question: "The smell of 'clean laundry' outside?",
    hint: "It’s a 'shared' neighborhood scent."
  },
  {
    question: "The visual of 'clouds' moving fast?",
    hint: "Be glad for the 'drama' in the sky."
  },
  {
    question: "The feeling of a 'hand-shake' or 'high-five'?",
    hint: "Focus on the 'physical agreement.'"
  },
  {
    question: "The sound of 'purring'?",
    hint: "It’s the 'audio of contentment.'"
  },
  {
    question: "The taste of 'sea salt'?",
    hint: "Be glad for the 'zing.'"
  },
  {
    question: "The sight of 'morning dew'?",
    hint: "It’s the 'Earth’s fresh start.'"
  },
  {
    question: "The feeling of 'holding a warm mug'?",
    hint: "It’s an 'anchor' for your hands."
  },
  {
    question: "The smell of 'pine trees'?",
    hint: "It’s the 'scent of the forest.'"
  },
  {
    question: "The visual of a 'city skyline' at night?",
    hint: "Be glad for the 'human hive.'"
  },
  {
    question: "The feeling of 'getting into a cold bed' and warming it up?",
    hint: "Focus on your 'internal heater.'"
  },
  {
    question: "The sound of 'rain on a tin roof'?",
    hint: "It’s the 'ultimate' cozy sound."
  },
  {
    question: "The taste of 'honey'?",
    hint: "Be glad for the 'liquid gold.'"
  },
  {
    question: "The sight of 'flowers' in a sidewalk crack?",
    hint: "Look for the 'persistence.'"
  },
  {
    question: "The feeling of 'taking your shoes off'?",
    hint: "Focus on the 'freedom' of your feet."
  },
  {
    question: "The smell of 'mint'?",
    hint: "It’s the 'scent of alertness.'"
  },
  {
    question: "The visual of 'mountains' in the distance?",
    hint: "Feel the 'age' of the Earth."
  },
  {
    question: "The feeling of 'swimming'?",
    hint: "Be glad for the 'weightlessness.'"
  },
  {
    question: "The sound of 'crickets' at night?",
    hint: "It’s the 'nightly pulse.'"
  },
  {
    question: "The taste of 'fresh bread'?",
    hint: "Focus on the 'texture.'"
  },
  {
    question: "The sight of 'snow' before it's walked on?",
    hint: "It’s a 'blank slate.'"
  },
  {
    question: "The feeling of 'socks' fresh out of the dryer?",
    hint: "It’s a 'hug' for your feet."
  },
  {
    question: "The smell of 'lemon'?",
    hint: "It’s the 'scent of clean.'"
  },
  {
    question: "The visual of 'waves' hitting the shore?",
    hint: "Be glad for the 'infinite' rhythm."
  },
  {
    question: "The feeling of 'braiding hair' or 'shaving'?",
    hint: "Focus on the 'grooming' ritual."
  },
  {
    question: "The sound of 'children laughing' nearby?",
    hint: "Be glad for the 'pure joy.'"
  },
  {
    question: "The taste of 'your favorite fruit'?",
    hint: "Be glad for the 'natural candy.'"
  },
  {
    question: "The sight of 'old architecture'?",
    hint: "Be glad for the 'stories' in the stone."
  },
  {
    question: "The feeling of 'petting an animal'?",
    hint: "Focus on the 'softness' and the 'bond.'"
  },
  {
    question: "The smell of 'lavender'?",
    hint: "It’s the 'scent of calm.'"
  },
  {
    question: "The visual of a 'garden' in bloom?",
    hint: "Be glad for the 'colors.'"
  },
  {
    question: "The feeling of 'ice' on a hot day?",
    hint: "Focus on the 'contrast.'"
  },
  {
    question: "The sound of 'thunder'?",
    hint: "Be glad for the 'power' of the sky."
  },
  {
    question: "The taste of 'cinnamon'?",
    hint: "It’s the 'scent of warmth.'"
  },
  {
    question: "The sight of 'fireflies'?",
    hint: "Be glad for the 'light-show.'"
  },
  {
    question: "The feeling of 'sand' between your fingers?",
    hint: "Focus on the 'tiny' pieces."
  },
  {
    question: "The smell of 'peppermint'?",
    hint: "It’s the 'scent of fresh.'"
  },
  {
    question: "The visual of 'a clear blue sky'?",
    hint: "Be glad for the 'limitless' feeling."
  },
  // Part 4: Modern Life, Tools & Infrastructure (241–320)
  {
    question: "High-speed internet?",
    hint: "Imagine waiting 10 minutes for one image to load."
  },
  {
    question: "The 'Undo' button (Ctrl+Z)?",
    hint: "Thank the digital gods for second chances."
  },
  {
    question: "Indoor plumbing?",
    hint: "Imagine walking to a well every time you needed water."
  },
  {
    question: "GPS on your phone?",
    hint: "Be grateful you’ll never truly be lost again."
  },
  {
    question: "Refrigeration?",
    hint: "Be glad your food stays fresh for days, not hours."
  },
  {
    question: "The 'Search' function?",
    hint: "You have the sum of human knowledge in your pocket."
  },
  {
    question: "Air conditioning/Heating?",
    hint: "Thank the machine that makes 'perfect weather' indoors."
  },
  {
    question: "Electricity at the flick of a switch?",
    hint: "Imagine living by candlelight only."
  },
  {
    question: "Headphones?",
    hint: "Be grateful for the 'private world' they create."
  },
  {
    question: "The 'Mute' button?",
    hint: "Use it to find peace in a noisy digital meeting."
  },
  {
    question: "Online banking?",
    hint: "Thank the 'convenience' of managing your life from a couch."
  },
  {
    question: "The 'Dark Mode' setting?",
    hint: "Be grateful for the relief it gives your eyes."
  },
  {
    question: "Automatic doors?",
    hint: "Feel like a wizard every time they open for you."
  },
  {
    question: "Public libraries?",
    hint: "Be glad for 'free' access to books and community."
  },
  {
    question: "Trash pickup?",
    hint: "Imagine the state of your street if they stopped coming."
  },
  {
    question: "The 'Snooze' button?",
    hint: "Be grateful for those 'bonus' 9 minutes of rest."
  },
  {
    question: "Emergency services (911)?",
    hint: "Feel the 'security' of knowing help is a call away."
  },
  {
    question: "Traffic lights?",
    hint: "Be grateful for the 'invisible order' that keeps you safe."
  },
  {
    question: "Your favorite 'App'?",
    hint: "Identify the one that actually makes your life easier."
  },
  {
    question: "Modern medicine (painkillers, antibiotics)?",
    hint: "Be glad we live in the 'age of health.'"
  },
  {
    question: "The 'Copy/Paste' function?",
    hint: "Imagine rewriting every sentence by hand."
  },
  {
    question: "Street lights at night?",
    hint: "Be grateful for the 'light' that keeps the night safe."
  },
  {
    question: "Postal service?",
    hint: "Be glad you can send a letter across the world for pennies."
  },
  {
    question: "Video calls?",
    hint: "Be grateful you can 'see' someone’s face from miles away."
  },
  {
    question: "The 'Cloud' storage?",
    hint: "Be glad your memories are safe even if you lose your phone."
  },
  {
    question: "Elevators/Escalators?",
    hint: "Thank the machine that does the 'climbing' for you."
  },
  {
    question: "Safe tap water?",
    hint: "It's a 'luxury' that billions still don't have."
  },
  {
    question: "The 'Bookmark' feature?",
    hint: "Be grateful you can 'pick up right where you left off.'"
  },
  {
    question: "Public transit (buses, trains)?",
    hint: "Be glad for the 'shared' movement."
  },
  {
    question: "The 'Calendar' app?",
    hint: "Thank the 'brain' outside your head that remembers for you."
  },
  {
    question: "Microwaves?",
    hint: "Be grateful for 'hot food' in 60 seconds."
  },
  {
    question: "Dishwashers/Washing Machines?",
    hint: "Thank the machine that saves you hours of labor."
  },
  {
    question: "Zippers and Velcro?",
    hint: "Be glad for 'fast' clothing."
  },
  {
    question: "The 'Find My Phone' feature?",
    hint: "Feel the 'relief' of finding it in the couch cushions."
  },
  {
    question: "Public parks?",
    hint: "Be grateful for the 'green lungs' of the city."
  },
  {
    question: "Standardized time?",
    hint: "Be glad everyone agrees what '3:00 PM' means."
  },
  {
    question: "Bridges?",
    hint: "Thank the 'engineering' that connects two pieces of land."
  },
  {
    question: "Podcasts/Audiobooks?",
    hint: "Be grateful for the 'company' during your chores."
  },
  {
    question: "Remote controls?",
    hint: "Be glad you don't have to get up to change the channel."
  },
  {
    question: "Vaccines?",
    hint: "Be grateful for the 'shield' around your health."
  },
  {
    question: "Standardized sizes (clothes, tools)?",
    hint: "Be glad that 'Medium' usually fits."
  },
  {
    question: "The 'Airplane' mode?",
    hint: "Be grateful for the 'forced' break from the world."
  },
  {
    question: "Social media (the good parts)?",
    hint: "Focus on the 'inspiration' or 'connection.'"
  },
  {
    question: "Batteries?",
    hint: "Be grateful for 'portable' power."
  },
  {
    question: "The 'Translate' feature?",
    hint: "Be glad you can 'understand' the whole world."
  },
  {
    question: "Paved roads?",
    hint: "Imagine driving on 'mud' every day."
  },
  {
    question: "The 'Filter' feature?",
    hint: "Be grateful you can 'find exactly what you need.'"
  },
  {
    question: "Sunglasses?",
    hint: "Thank the 'shield' for your eyes."
  },
  {
    question: "Weather forecasts?",
    hint: "Be glad you can 'prepare' for the storm."
  },
  {
    question: "The 'Caps Lock' key?",
    hint: "For the times you need to be 'heard.'"
  },
  {
    question: "Digital photos?",
    hint: "Be grateful for 'infinite' memories without the film cost."
  },
  {
    question: "The 'Silent' mode?",
    hint: "Thank the 'peace' it provides."
  },
  {
    question: "Street signs?",
    hint: "Be glad for the 'guidance.'"
  },
  {
    question: "The 'Speakerphone' feature?",
    hint: "Be grateful for 'hands-free' living."
  },
  {
    question: "Public restrooms?",
    hint: "Be glad they are 'there' when you need them."
  },
  {
    question: "The 'Heart' or 'Like' button?",
    hint: "Be grateful for the 'tiny bit of love' you can send."
  },
  {
    question: "Bluetooth?",
    hint: "Thank the 'invisible wires.'"
  },
  {
    question: "The 'Zoom' feature (cameras)?",
    hint: "Be grateful for 'seeing the details.'"
  },
  {
    question: "Online reviews?",
    hint: "Thank the 'wisdom of the crowd' for saving you money."
  },
  {
    question: "The 'Escape' key?",
    hint: "For when you just need to 'get out.'"
  }
  ,
  {
    question: "What is a 'fun fact' you know that always delights people?",
    hint: "Be grateful for your curiosity and your ability to entertain others."
  },
  {
    question: "What is a language or slang you’re glad you understand?",
    hint: "Think about how this specific way of speaking connects you to a culture or group."
  },
  {
    question: "What is a complex idea you finally clicked with recently?",
    hint: "Celebrate the Aha! moment when something difficult became clear."
  },
  {
    question: "Which free resource like Wikipedia or a library do you use most?",
    hint: "Imagine how much harder it would be to learn without this open access."
  },
  {
    question: "What is a specific color combination that makes you feel peaceful?",
    hint: "Notice the art in your daily life, like a sunset against a blue building."
  },
  {
    question: "What is a question someone asked you that made you think deeply?",
    hint: "Be grateful for people who challenge your perspective."
  },
  {
    question: "What is a thought experiment or philosophy that helps you stay grounded?",
    hint: "Think of ideas like Stoicism, or the this too shall pass mindset."
  },
  {
    question: "What is a piece of bad art or a cheesy movie you love anyway?",
    hint: "Appreciate your own unique taste and the joy it brings you."
  },
  {
    question: "What is a scientific discovery that makes you feel safer?",
    hint: "Think of things like germ theory, gravity, or electricity."
  },
  {
    question: "What is a craft or DIY project you finished, even if it’s not perfect?",
    hint: "Be grateful for the coordination between your mind and your hands."
  },
  {
    question: "What is a mystery in the world that you enjoy not knowing the answer to?",
    hint: "Appreciate the sense of wonder that comes from the unknown."
  },
  {
    question: "What is a metaphor that perfectly describes your life right now?",
    hint: "Be glad for the creative brain that allows you to see patterns."
  },
  {
    question: "What is a podcast or book that makes you feel like you’re part of a conversation?",
    hint: "Acknowledge the parasocial friends who keep you company."
  },
  {
    question: "What is a word in another language that has no English equivalent but you love?",
    hint: "For example, Hygge or Saudade. Appreciate how words shape our feelings."
  },
  {
    question: "What is a brain game or puzzle like Sudoku or Wordle you enjoy?",
    hint: "Be grateful for your brain’s desire to solve problems."
  },
  {
    question: "What is a historical era you’re glad you didn’t have to live through?",
    hint: "Use the past to appreciate the comforts of 2026."
  },
  {
    question: "What is a specific map or GPS feature that has saved you from getting lost?",
    hint: "Think about the invisible satellites working just for you."
  },
  {
    question: "What is a poem or song lyric that feels like it was written for you?",
    hint: "Be grateful for the artist who put your feelings into words."
  },
  {
    question: "What is a logical part of your brain that you appreciate?",
    hint: "Thank your mind for its ability to organize and plan."
  },
  {
    question: "What is a creative spark you had this week, even if you didn’t act on it?",
    hint: "Appreciate the antenna in your head that picks up new ideas."
  },
  {
    question: "What is a specific shortcut or hack you use at work?",
    hint: "Be grateful for your own efficiency and cleverness."
  },
  {
    question: "Who is a colleague who makes the workday go by faster?",
    hint: "Focus on the humor or the shared struggle that bonds you."
  },
  {
    question: "What is a piece of stationery you love using?",
    hint: "Notice how the right tool makes the work feel more satisfying."
  },
  {
    question: "What is a boring meeting that actually provided a moment of clarity?",
    hint: "Look for the one useful sentence in an hour of talk."
  },
  {
    question: "What is a professional boundary you’ve successfully maintained?",
    hint: "Thank yourself for protecting your time and energy."
  },
  {
    question: "What is a work from home or commute perk you enjoy?",
    hint: "Is it the cozy socks or the specific podcast you listen to on the train?"
  },
  {
    question: "What is a task you’re the expert at in your circle?",
    hint: "Feel the confidence that comes with being the go-to person."
  },
  {
    question: "What is a piece of feedback that was hard to hear but made you better?",
    hint: "Be grateful for the growth that came from the sting."
  },
  {
    question: "What is a Friday afternoon feeling you’ve had recently?",
    hint: "Describe the physical relief of a finished week."
  },
  {
    question: "What is a tool or software that does the heavy lifting for you?",
    hint: "Think of Excel, AI, or even just a calculator."
  },
  {
    question: "What is a work win you didn't tell anyone about?",
    hint: "Celebrate the quiet satisfaction of a job well done."
  },
  {
    question: "What does a clean To Do list or a cleared inbox feel like?",
    hint: "Focus on the mental space that opens up when things are done."
  },
  {
    question: "What is a coffee shop or workspace that helps you focus?",
    hint: "Be grateful for the environment that supports your goals."
  },
  {
    question: "What is a mentor who taught you what not to do?",
    hint: "Sometimes seeing a bad example is the best education."
  },
  {
    question: "What is a difficult client or customer who taught you patience?",
    hint: "They are your patience gym—be glad for the workout."
  },
  {
    question: "What is the feeling of taking your work shoes off?",
    hint: "Focus on the literal transition from doing to being."
  },
  {
    question: "What is a benefit your job provides?",
    hint: "Think health insurance, a paycheck, or social time."
  },
  {
    question: "What is a project you finished that you never have to do again?",
    hint: "Feel the sweet relief of completion."
  },
  {
    question: "What is a way you’ve helped a teammate lately?",
    hint: "Be grateful for the capacity to be a resource for others."
  },
  {
    question: "What is a break room or water cooler conversation that made you smile?",
    hint: "Appreciate the small human moments in a professional setting."
  },
  {
    question: "What is a bridge or road you use often that is actually an engineering marvel?",
    hint: "Think about the thousands of people who built it for your convenience."
  },
  {
    question: "What is a public service you are glad for?",
    hint: "Imagine your life if trash pickup, mail, or fire services stopped for a week."
  },
  {
    question: "What is a standardized thing like USB ports or light bulbs that makes life easy?",
    hint: "Be grateful for the people who agreed on one way to do things."
  },
  {
    question: "What is a warning label that actually helped you stay safe?",
    hint: "Appreciate the hidden guardians who look out for you."
  },
  {
    question: "What is a grocery store supply chain miracle you benefited from today?",
    hint: "Think of the global effort required to put that item in your hand."
  },
  {
    question: "What is a sensor like a motion light or automatic door you appreciate?",
    hint: "It’s like a tiny robot waiting to serve you."
  },
  {
    question: "What is the cloud doing for your memories?",
    hint: "Be grateful your photos are safe even if you lose your phone."
  },
  {
    question: "What is a quiet law or rule that keeps your neighborhood peaceful?",
    hint: "Think of noise ordinances or traffic lights."
  },
  {
    question: "What is a subscription that is actually worth every penny?",
    hint: "Does it save you time, or bring you constant joy?"
  },
  {
    question: "What is a customer support person who actually solved your problem?",
    hint: "Remember the relief of talking to a human who cared."
  },
  {
    question: "What is a packaging design that is surprisingly clever?",
    hint: "Think of a tear here strip that actually worked."
  },
  {
    question: "What is a public park or green space maintained by your taxes?",
    hint: "Be grateful for the shared backyard you have access to."
  },
  {
    question: "What is a weather forecast that helped you plan your day?",
    hint: "Appreciate the scientists who predict the future."
  },
  {
    question: "What is a refrigerator noise or fan hum that means things are working?",
    hint: "Learn to love the sounds of a working home."
  },
  {
    question: "What is a bank app or digital payment that saves you a trip to the bank?",
    hint: "Think about the hours of errand time you’ve saved."
  },
  {
    question: "What is a street performer or public art you saw recently?",
    hint: "Be grateful for people who add beauty to the streets for free."
  },
  {
    question: "What is a drain or gutter that keeps your house from flooding?",
    hint: "Thank the unseen parts of your home for doing their job."
  },
  {
    question: "What is a time zone that allows you to talk to someone far away?",
    hint: "Be grateful for the math that keeps the world synchronized."
  },
  {
    question: "What is a pharmacy or clinic nearby?",
    hint: "Feel the safety of knowing help is close by if you need it."
  },
  {
    question: "What is a seatbelt or airbag in your car?",
    hint: "Acknowledge the invisible safety net surrounding you while you drive."
  },
  {
    question: "What is the feeling of your head hitting a cool pillow?",
    hint: "Focus on the temperature change and the instant relaxation."
  },
  {
    question: "What is the crunch of a specific food like a chip or an apple?",
    hint: "Appreciate the auditory and tactile experience of eating."
  },
  {
    question: "What is the smell of a new car or new book?",
    hint: "Why does that scent signal a fresh start to you?"
  },
  {
    question: "What is the feeling of a heavy blanket in winter?",
    hint: "Focus on the pressure and how it makes you feel protected."
  },
  {
    question: "What is the sight of dust motes dancing in a sunbeam?",
    hint: "Look for the beauty in the tiny, everyday things."
  },
  {
    question: "What is the sound of white noise while you sleep?",
    hint: "Be grateful for the blanket of sound that drowns out the world."
  },
  {
    question: "What is the taste of perfectly cold water when you are thirsty?",
    hint: "Focus on the sensation of life-giving hydration."
  },
  {
    question: "What is the first bite of a meal when you are truly hungry?",
    hint: "Notice how the flavor is intensified by your body’s need."
  },
  {
    question: "What is the feeling of stretching your muscles after sitting too long?",
    hint: "Be grateful for the release and the flexibility of your body."
  },
  {
    question: "What is the sound of your own laughter?",
    hint: "When was the last time you heard it? Be glad it exists."
  },
  {
    question: "What is the feeling of clean skin after a long day?",
    hint: "Appreciate the transition from the world to your home."
  },
  {
    question: "What is the sight of a full moon or a starry night?",
    hint: "Be grateful for the perspective the universe provides."
  },
  {
    question: "What is the smell of baking bread or toasting nuts?",
    hint: "Why does a warm smell feel like safety?"
  },
  {
    question: "What is the feeling of sand between your toes or grass on your feet?",
    hint: "Acknowledge the direct connection to the earth."
  },
  {
    question: "What is the pop of a cork or the fizz of a soda?",
    hint: "Appreciate the festive sound of a simple pleasure."
  },
  {
    question: "What is the feeling of holding hands with someone you care about?",
    hint: "Focus on the warmth and the silent communication."
  },
  {
    question: "What is the steam rising from a bowl of soup?",
    hint: "Look at the patterns in the vapor—it’s a tiny, temporary dance."
  },
  {
    question: "What is the sight of organized things like a spice rack or bookshelf?",
    hint: "Be grateful for the order you’ve created in your world."
  },
  {
    question: "What is the feeling of a hot towel or warm laundry?",
    hint: "It’s like a hug from a machine."
  },
  {
    question: "What is the sound of morning birds before the traffic starts?",
    hint: "Be grateful for the first shift of nature."
  },
  {
    question: "What is a long-term goal you’ve stopped worrying about?",
    hint: "Be grateful for the peace of mind that comes with letting go."
  },
  {
    question: "What is a generational gift you have from your family?",
    hint: "See yourself as a link in a very long, successful chain."
  },
  {
    question: "What is the future you going to thank you for doing today?",
    hint: "Be grateful for your own discipline and foresight."
  },
  {
    question: "What is a historical event you witnessed that changed you?",
    hint: "Acknowledge your role as a witness to history."
  },
  {
    question: "What is a secret talent you have that you rarely use?",
    hint: "Be glad you have extra parts of yourself kept in reserve."
  },
  {
    question: "What is a tradition you started for yourself?",
    hint: "Celebrate your agency to create your own meaning."
  },
  {
    question: "What is a deeper truth you’ve discovered about life?",
    hint: "Be grateful for the wisdom that only comes with time."
  },
  {
    question: "What is a person from your past you still think of fondly?",
    hint: "Be grateful for the footprint they left on your soul."
  },
  {
    question: "What is a mistake you are glad you made young?",
    hint: "Thank your younger self for getting that lesson out of the way early."
  },
  {
    question: "What is a seasonal food you can only get right now?",
    hint: "Appreciate the scarcity that makes it taste better."
  },
  {
    question: "What is a boring Sunday afternoon?",
    hint: "Why is nothing to do actually a massive luxury?"
  },
  {
    question: "What is a physical object you want to pass down one day?",
    hint: "Be grateful for the stories attached to your belongings."
  },
  {
    question: "What is a habit you broke that was holding you back?",
    hint: "Celebrate the freedom of no longer being controlled by it."
  },
  {
    question: "What is a compliment you gave yourself today?",
    hint: "Be grateful for the internal best friend you are becoming."
  },
  {
    question: "What is a small coincidence that felt like a sign?",
    hint: "Even if it’s just luck, be grateful for the magic feeling."
  },
  {
    question: "What is a letter or email you’re glad you didn't send?",
    hint: "Thank your cool-down period for saving you from a mess."
  },
  {
    question: "What is a part of your personality that is exactly like one of your parents?",
    hint: "Look for the good version of that trait and be glad for the inheritance."
  },
  {
    question: "What is a city or landscape you want to visit someday?",
    hint: "Be grateful for the wanderlust that keeps you curious."
  },
  {
    question: "What is the feeling of waking up before your alarm goes off?",
    hint: "Appreciate the extra gift of time you didn't expect."
  },
  {
    question: "What is the one thing that would still make life worth it?",
    hint: "Identify your core gratitude, the pilot light that never goes out."
  }
];

export default function Journal() {
  const navigate = useNavigate();

const PROMPT_CATEGORIES = [
  'Intellectual & Creative Curiosity',
  'Workplace & Productivity',
  'Invisible Infrastructure',
  'Niche Sensory & Micro-Gratitude',
  'Philosophical & Time-Based',
];

const PROMPTS_PER_CATEGORY = 20;
const PROMPTS_PER_SET = 100;

const getPromptCategory = (index: number) => {
  const categoryIndex = Math.floor((index % PROMPTS_PER_SET) / PROMPTS_PER_CATEGORY);
  return PROMPT_CATEGORIES[categoryIndex] ?? PROMPT_CATEGORIES[0];
};

const getPromptSetLabel = (index: number) => `Set ${Math.floor(index / PROMPTS_PER_SET) + 1}`;

const SAVED_ENTRIES_STORAGE_KEY = 'greatful.savedEntries';

type JournalEntry = {
  prompt: string;
  answer: string;
  date: string;
};

const DEFAULT_HISTORY: JournalEntry[] = [
  {
    prompt: "What is a habit you’ve built that you’re proud of?",
    answer: "Not smoking all day",
    date: new Date().toLocaleDateString()
  },
  {
    prompt: "What part of your body do you often overlook but are grateful for today?",
    answer: "My fingers",
    date: new Date().toLocaleDateString()
  },
  {
    prompt: "What is a personality trait of yours that has helped you in a crisis?",
    answer: "I can sell icicles to eskimos and sand to the arrab s also my honesty",
    date: new Date().toLocaleDateString()
  }
];

const loadSavedEntries = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_HISTORY;
  }

  try {
    const storedEntries = window.localStorage.getItem(SAVED_ENTRIES_STORAGE_KEY);

    if (!storedEntries) {
      return DEFAULT_HISTORY;
    }

    const parsedEntries = JSON.parse(storedEntries) as JournalEntry[];

    return Array.isArray(parsedEntries) && parsedEntries.length > 0 ? parsedEntries : DEFAULT_HISTORY;
  } catch {
    return DEFAULT_HISTORY;
  }
};
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [blessed, setBlessed] = useState("");
  const [because, setBecause] = useState("");
  const [confetti, setConfetti] = useState<{
    id: number;
    left: string;
    top: string;
    x: number;
    y: number;
    rotate: number;
    duration: number;
    delay: number;
    color: string;
    size: number;
  }[]>([]);
  const [history, setHistory] = useState<JournalEntry[]>(loadSavedEntries);
  const [showSuccess, setShowSuccess] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    window.localStorage.setItem(SAVED_ENTRIES_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    return () => {
      void audioContextRef.current?.close();
    };
  }, []);

  const playSaveSound = () => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    const now = audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.09);

      gainNode.gain.setValueAtTime(0.0001, now + index * 0.09);
      gainNode.gain.exponentialRampToValueAtTime(0.14, now + index * 0.09 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.26);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(now + index * 0.09);
      oscillator.stop(now + index * 0.09 + 0.28);
    });
  };

  const triggerConfetti = () => {
    const colors = ['#FF1493', '#00FFFF', '#FFD700', '#FFFFFF', '#FF5F1F', '#7CFF6B'];

    const pieces = Array.from({ length: 72 }, (_, id) => ({
      id,
      left: `${50 + (Math.random() * 18 - 9)}%`,
      top: `${48 + (Math.random() * 10 - 5)}%`,
      x: Math.round(Math.random() * 680 - 340),
      y: Math.round(Math.random() * -460 - 140),
      rotate: Math.round(Math.random() * 1080 - 540),
      duration: 1100 + Math.random() * 900,
      delay: Math.random() * 120,
      color: colors[id % colors.length],
      size: 8 + Math.round(Math.random() * 10),
    }));

    setConfetti(pieces);

    window.setTimeout(() => {
      setConfetti([]);
    }, 2200);
  };

  const handleNext = () => {
    if (currentPromptIndex < INITIAL_PROMPTS.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
    } else {
      setCurrentPromptIndex(0);
    }
    setBlessed("");
    setBecause("");
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * INITIAL_PROMPTS.length);
    setCurrentPromptIndex(randomIndex);
    setBlessed("");
    setBecause("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!blessed.trim() || !because.trim()) return;

    const newEntry: JournalEntry = {
      prompt: INITIAL_PROMPTS[currentPromptIndex].question,
      answer: `Blessed: ${blessed}\nBecause: ${because}`,
      date: new Date().toLocaleDateString()
    };

    setHistory(prev => [newEntry, ...prev]);
    setBlessed("");
    setBecause("");
    setShowSuccess(true);
    playSaveSound();
    triggerConfetti();
    
    setTimeout(() => {
      setShowSuccess(false);
      handleNext();
    }, 2000);
  };

  return (
    <div className="min-h-screen stripe-pattern p-4 md:p-8 relative">
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        <AnimatePresence>
          {confetti.map((piece) => (
            <motion.span
              key={piece.id}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.6, rotate: 0 }}
              animate={{
                x: piece.x,
                y: piece.y,
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1.15, 1],
                rotate: piece.rotate,
              }}
              transition={{
                duration: piece.duration / 1000,
                delay: piece.delay / 1000,
                ease: 'easeOut',
              }}
              className="absolute rounded-sm"
              style={{
                left: piece.left,
                top: piece.top,
                width: `${piece.size}px`,
                height: `${Math.max(4, Math.round(piece.size * 0.6))}px`,
                backgroundColor: piece.color,
                boxShadow: `0 0 16px ${piece.color}, 0 0 28px ${piece.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Blessed Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, rotate: -10 }}
              animate={{ 
                scale: [0.5, 1.2, 1], 
                y: 0, 
                rotate: 0,
                textShadow: [
                  "0 0 20px #FF1493",
                  "0 0 40px #FF1493",
                  "0 0 20px #FF1493"
                ] 
              }}
              className="p-8 border-8 border-neon-pink bg-white shadow-[0_0_50px_#FF1493]"
            >
              <h1 className="text-8xl md:text-9xl font-display font-black text-black italic tracking-tighter uppercase leading-none px-8 py-4">
                Blessed
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-8xl mx-auto text-black relative z-10">
        <motion.button 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-black bg-white px-4 py-2 rounded-full font-bold uppercase tracking-tighter mb-8 hover:bg-neon-pink hover:text-white transition-colors border-2 border-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </motion.button>

        <div className="grid grid-cols-1 gap-8">
          {/* Quick Entry Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black p-8 rounded-3xl border-4 border-neon-pink shadow-2xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Sparkles className="w-12 h-12 text-neon-pink" />
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display italic text-neon-pink flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Reflect
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleRandom}
                  className="text-xs font-bold uppercase tracking-tighter text-white/50 hover:text-[#00FFFF] transition-colors flex items-center gap-1"
                >
                  <Shuffle className="w-3 h-3" />
                  Random
                </button>
                <button 
                  onClick={handleNext}
                  className="text-xs font-bold uppercase tracking-tighter text-white/50 hover:text-neon-pink transition-colors flex items-center gap-1"
                >
                  Skip
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {PROMPT_CATEGORIES.map((category, index) => {
                const isActive = category === getPromptCategory(currentPromptIndex);

                return (
                  <span
                    key={category}
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isActive ? 'bg-neon-pink text-black border-neon-pink' : 'bg-white/5 text-white/60 border-white/10'}`}
                  >
                    {index + 1}. {category}
                  </span>
                );
              })}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromptIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-8 min-h-[140px]"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] bg-white text-black px-3 py-1 rounded-full">
                    {getPromptSetLabel(currentPromptIndex)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] bg-neon-pink text-black px-3 py-1 rounded-full">
                    {getPromptCategory(currentPromptIndex)}
                  </span>
                </div>
                <p className="text-xl font-bold italic mb-2">"{INITIAL_PROMPTS[currentPromptIndex].question}"</p>
                {INITIAL_PROMPTS[currentPromptIndex].hint && (
                  <p className="text-sm text-neon-pink/80 font-medium italic">
                    Hint: {INITIAL_PROMPTS[currentPromptIndex].hint}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Blessed</label>
                  <textarea
                    value={blessed}
                    onChange={(e) => setBlessed(e.target.value)}
                    placeholder="What are you blessed with?"
                    className="w-full h-40 bg-white/10 border-2 border-white/20 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Because</label>
                  <textarea
                    value={because}
                    onChange={(e) => setBecause(e.target.value)}
                    placeholder="Why does it matter?"
                    className="w-full h-40 bg-white/10 border-2 border-white/20 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink transition-colors resize-none"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-neon-pink py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-neon-pink transition-all border-2 border-neon-pink disabled:opacity-50"
                disabled={!blessed.trim() || !because.trim() || showSuccess}
              >
                {showSuccess ? "Entry Saved!" : "Save Moment"}
                <Send className="w-4 h-4" />
              </motion.button>

              <button
                type="button"
                onClick={() => navigate('/entries')}
                className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-neon-pink hover:text-white transition-colors border-2 border-black"
              >
                View Saved Entries
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
