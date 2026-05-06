import { Injectable } from "@nestjs/common";
import videosTable, { type Video } from "models/videos";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class VideoSeedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async seed(): Promise<void> {
    const videos: Omit<Video, "id" | "createdAt">[] = [
      {
        title: "Weathering the Storm",
        thumbnail: "https://img.youtube.com/vi/6dVI3gOEGXo/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420036/Metro_2039_-_Official_Reveal_Trailer_o62c2u.mp4",
        description:
          "Internal storm brewing. Negative emotions, restlessness, feeling lost or unsure. Questions creeping in. This is normal and temporary.",
        messages: {
          theme: "Tie down the sails and hold on.",
          whatToExpect:
            "Internal storm brewing. Negative emotions, restlessness, feeling lost or unsure. Questions creeping in. This is normal and temporary.",
          objective: "Don't drink. Take it easy.",
          focusAreas: [
            "Take it easy — no pressure to optimize yet",
            "Get outside, go on walks, move your body gently",
            "Strengthen your resolve with external resources",
            "Consider clearing the decks with social and work engagements if your feeling a bit woozy.."
          ],
          resources: ["Alcohol Lied to Me — Craig Beck", "Huberman Lab podcast episode on alcohol"]
        },
        type: "HOME",
        week: 1,
        day: 1,
        duration: 6
      },
      {
        title: "Finding Your Sea Legs",
        thumbnail: "https://img.youtube.com/vi/e94diATcVPY/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420027/Street_Fighter_-_Official_Trailer_2026_Noah_Centineo_Andrew_Koji_Callina_Liang_blkdzj.mp4",
        description:
          "Initial intensity fades but you may still feel a sense of loss, quiet, dullness, or unease. This is grief and it's normal.",
        messages: {
          theme: "The storm is passing. Land is out of sight. The journey is real now.",
          whatToExpect:
            "Initial intensity fades but you may still feel a sense of loss, quiet, dullness, or unease. This is grief and it's normal. Point all of it squarely at alcohol — treat it like an ex who did you dirty.",
          objective: "Stay steady. Trust the process.",
          focusAreas: [
            "Dial in meal planning",
            "Introduce/optimize supplements",
            "Build and protect your sleep schedule",
            "Start getting on track with daily structure"
          ]
        },
        type: "HOME",
        week: 3,
        day: 2,
        duration: 3
      },
      {
        title: "Life at Sea",
        thumbnail: "https://img.youtube.com/vi/hpTeYqxKdmQ/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420008/The_Dog_Stars_-_Official_Trailer_2026_Jacob_Elordi_Josh_Brolin_c9f0h0.mp4",
        description:
          "Hormones stabilizing. Cravings subsiding. Energy returning. You're starting to feel the upside… but it’s subtle.",
        messages: {
          theme: "Setting the course. Body is recovering. Horizon is clear.",
          whatToExpect:
            "Hormones stabilizing. Cravings subsiding. Energy returning. You're starting to feel the upside… but it’s subtle.",
          objective: "Stay no-booze and start trimming reactionary vices.",
          focusAreas: [
            "Pull back on sugar, caffeine, and other compensatory habits",
            "Lock in sleep protocol and diet",
            "Play offense at social and work events — know what to say, know what to bring",
            "Prepare and practice social scripts for drinking situations"
          ]
        },
        type: "HOME",
        week: 5,
        day: 3,
        duration: 2
      },
      {
        title: "Land Grab",
        thumbnail: "https://img.youtube.com/vi/a-T0TlMN-RE/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776419994/The_Brink_Of_War_-_Official_Trailer_-_In_Theaters_Aug_14_-_Angel_cge9ot.mp4",
        description: "Full momentum. Confidence building. Wins compounding. This is where it gets good.",
        messages: {
          theme: "All systems go. Monk mode. Take what's yours.",
          whatToExpect: "Full momentum. Confidence building. Wins compounding. This is where it gets good.",
          objective: "Execute. Lock in habits and mindset. Less thinking, more doing.",
          focusAreas: [
            "More workouts, more events, more growth",
            "Stack wins and build gratitude practice",
            "Lean into confidence and social momentum",
            "Aggressive habit reinforcement"
          ]
        },
        type: "HOME",
        week: 7,
        day: 4,
        duration: 2
      },
      {
        title: "Lock In the Gains",
        thumbnail: "https://img.youtube.com/vi/ClY-3UopEeU/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420035/Agefield_High__Rock_the_School_Official_Gameplay_Overview_Trailer_wmhso8.mp4",
        description: "New habits feeling automatic. The lifestyle is becoming yours, not a program you're on.",
        messages: {
          theme: "Repetition becomes identity. Your identity is getting a serious upgrade.",
          whatToExpect: "New habits feeling automatic. The lifestyle is becoming yours, not a program you're on.",
          objective: "Reinforce, refine, and keep rocking it.",
          focusAreas: [
            "More reps on every habit front",
            "Keep refining sleep, diet, and schedule",
            "Build on wins — document and celebrate progress",
            "Mindset work: this is who you are now"
          ]
        },
        type: "HOME",
        week: 9,
        day: 5,
        duration: 12
      },
      {
        title: "Choose Your Adventure",
        thumbnail: "https://img.youtube.com/vi/ClY-3UopEeU/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420035/Agefield_High__Rock_the_School_Official_Gameplay_Overview_Trailer_wmhso8.mp4",
        description: "Full clarity on how good life can feel. Decision point ahead.",
        messages: {
          theme: "The voyage is yours. What's next, Captain?",
          whatToExpect: "Full clarity on how good life can feel. Decision point ahead.",
          objective: "Choose your path and own it.",
          paths: [
            "🚢 Extend the Voyage — Keep the vacation going. We give you the protocols to keep building and stay at your peak.",
            "⚓ Return to Port — Ready to think about reintroducing alcohol. We guide you through how to think about it intentionally, strategically, and on your terms."
          ]
        },
        type: "SLEEP",
        week: 11,
        day: 6,
        duration: 5
      },
      {
        title: "Welcome Aboard",
        thumbnail: "",
        videoURL: "",
        description:
          "Hey, I'm Clifford — Chief Vacation Officer at BoozeVacation. Over the next two weeks, I'm going to send you a short 2-minute video every day so you can get a real feel for who we are, what we do, and whether this is the right move for you. No pressure. No pitch. Just the straight goods so you can make a smart decision. Let's go.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 1,
        duration: 2
      },
      {
        title: "Are You Our Guy?",
        thumbnail: "",
        videoURL: "",
        description:
          "We work with successful men — 30s to 60s — who are showing signs of metabolic dysfunction and drink socially but don't have an alcohol problem. If that's you, you're in exactly the right place. If it's not, no hard feelings — this just isn't built for you. We'd rather be honest upfront than waste your time.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 2,
        duration: 2
      },
      {
        title: "The Problem Nobody's Connecting",
        thumbnail: "",
        videoURL: "",
        description:
          "93% of Americans have metabolic dysfunction — belly fat, bad bloodwork, high blood pressure, inflammation, aches and pains. And 75% don't sleep well, which makes every single one of those issues dramatically worse. Here's what nobody's telling you: if you don't fix your sleep first, it doesn't matter what healthy habits you stack on top. You'll work twice as hard for half the results. And regular alcohol use? It makes both problems worse — and makes them nearly impossible to fix.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 3,
        duration: 2
      },
      {
        title: "The Fork in the Road",
        thumbnail: "",
        videoURL: "",
        description:
          "Most guys take the default path — treat each symptom separately with medications, procedures, and quick fixes. You get temporary relief, side effects, more problems downstream, and a lower quality of life. Or you play a smarter game — go upstream, fix the root cause, and watch the symptoms clear up together. Faster. Easier. That's the game we play.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 4,
        duration: 2
      },
      {
        title: "The Game We're Playing",
        thumbnail: "",
        videoURL: "",
        description:
          "Here's exactly how we do it. We fix your sleep first — because when sleep improves, your metabolic health improves, your hormones rebound, and your energy and body composition start shifting. Then we make some straightforward adjustments to diet, meal planning, and scheduling to stack even more gains. And we guide you through a 90-day break from alcohol so we can actually dial in your sleep without simultaneously torching it. Most of these benefits happen while you sleep — like a great investment working for you around the clock.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 5,
        duration: 2
      },
      {
        title: "The Upside — What's Actually on the Table",
        thumbnail: "",
        videoURL: "",
        description:
          "Guys who go through BoozeVacation get better sleep, better body composition, better bloodwork, and more energy. They look better, feel better, and perform better — in the gym, at work, and in the bedroom. This isn't a weight loss program or a sobriety program. It's a performance reset that fixes the upstream stuff so everything downstream gets easier.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 6,
        duration: 2
      },
      {
        title: "Your Love Stick Is On the Line",
        thumbnail: "",
        videoURL: "",
        description:
          "Sexual health is your body's dipstick — it's one of the first things to reflect what's actually going on under the hood. Great sexual health depends on quality sleep, optimal hormones, low stress, and low inflammation. Alcohol and age are a dangerous combo when it comes to all four. Don't gamble with it. This one's too important to ignore.",
        messages: {},
        type: "ORIENTATION",
        week: 1,
        day: 7,
        duration: 2
      },
      {
        title: "Why the Alcohol Break?",
        thumbnail: "",
        videoURL: "",
        description:
          "We know what you're thinking. Here's the straight answer on why the break is non-negotiable, what happens to your sleep when alcohol is in the picture, and why even moderate social drinking is enough to keep you stuck. This isn't about having a problem. It's about getting results.",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 8,
        duration: 2
      },
      {
        title: "Your Social Life Isn't Over",
        thumbnail: "",
        videoURL: "",
        description:
          "Work events. Dinners. Weekends. Birthdays. We've got a full game plan for navigating all of it — and we're going to make this a flex, not a liability. You won't be on defense explaining yourself all night. You'll know exactly what to say, what to order, and how to own the room. We make this fun.",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 9,
        duration: 2
      },
      {
        title: "Don't Wait Until It Gets Worse",
        thumbnail: "",
        videoURL: "",
        description:
          "Just because metabolic dysfunction and bad sleep are common doesn't mean they're harmless. Most guys in their 40s and 50s are one or two years away from these manageable symptoms becoming something much harder to reverse. It's not a scare tactic — it's just biology. The earlier you address this, the faster and easier the results. Waiting costs more than the break does.",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 10,
        duration: 2
      },
      {
        title: "What Happens Once You Set Sail",
        thumbnail: "",
        videoURL: "",
        description:
          "Here's what the next 90 days actually look like. We walk you through the voyage in two-week phases — each one with a clear objective, a focus area, and daily habit tracking built into the app. You always know where you are, what you're doing, and what's coming next. No guesswork.",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 11,
        duration: 2
      },
      {
        title: "Guys Like You — Real Results",
        thumbnail: "",
        videoURL: "",
        description: "[Jason story + any other client wins. Real numbers, real transformations, real guys.]",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 12,
        duration: 2
      },
      {
        title: "Your Questions Answered",
        thumbnail: "",
        videoURL: "",
        description:
          "Rapid fire on the most common questions we get: What if I don't drink that much? What about my diet — do I have to overhaul everything? How hard is this really? What if I slip up? What kind of support do I get? All answered here.",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 13,
        duration: 2
      },
      {
        title: "Are You Ready to Set Sail?",
        thumbnail: "",
        videoURL: "",
        description:
          "Quick readiness checklist — do you understand the game, do you know what you're signing up for, and are you ready to go? If yes, let's go. Here's how to get started. If you need more time, no problem — here's how to stay in touch. Either way, you now know exactly what this is and whether it's right for you.",
        messages: {},
        type: "ORIENTATION",
        week: 2,
        day: 14,
        duration: 2
      }
    ];

    try {
      await this.databaseService.db.insert(videosTable).values(videos);
    } catch (error) {
      console.error("Error seeding videos:", error);
      throw error;
    }
  }
}
