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
        type: "ORIENTATION",
        week: 1,
        day: 0,
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
        type: "ORIENTATION",
        week: 2,
        day: 0,
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
        type: "ORIENTATION",
        week: 3,
        day: 0,
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
        type: "ORIENTATION",
        week: 4,
        day: 0,
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
        type: "ORIENTATION",
        week: 5,
        day: 0,
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
        type: "ORIENTATION",
        week: 6,
        day: 0,
        duration: 5
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
