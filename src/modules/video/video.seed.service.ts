import { Injectable } from "@nestjs/common";
import videosTable, { type Video } from "models/videos";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class VideoSeedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async seed(): Promise<void> {
    const videos: Omit<Video, "id" | "createdAt">[] = [
      {
        title: "Metro 2039 - Official Reveal Trailer",
        thumbnail: "https://img.youtube.com/vi/6dVI3gOEGXo/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420036/Metro_2039_-_Official_Reveal_Trailer_o62c2u.mp4",
        description:
          "Check out the reveal trailer for 4A Games much anticipated new entry in the post-apocalyptic world of Metro. Metro 2039. ",
        type: "ORIENTATION",
        week: 1,
        time: 6
      },
      {
        title: "Street Fighter - Official Trailer (2026) Noah Centineo, Andrew Koji, Callina Liang",
        thumbnail: "https://img.youtube.com/vi/e94diATcVPY/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420027/Street_Fighter_-_Official_Trailer_2026_Noah_Centineo_Andrew_Koji_Callina_Liang_blkdzj.mp4",
        description:
          "Take a look at the Official Trailer for Street Fighter, the upcoming action fighting movie based on the hit video game series distributed by Paramount Pictures. Witness the fight of a lifetime with a star-studded cast in Street Fighter, in theaters on October 16.",
        type: "ORIENTATION",
        week: 2,
        time: 3
      },
      {
        title: "The Dog Stars - Official Trailer (2026) Jacob Elordi, Josh Brolin",
        thumbnail: "https://img.youtube.com/vi/hpTeYqxKdmQ/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420008/The_Dog_Stars_-_Official_Trailer_2026_Jacob_Elordi_Josh_Brolin_c9f0h0.mp4",
        description:
          '"The Dog Stars," is a riveting, epic thriller set in a world where survival is instinct, but humanity is a choice. Scott tells the story of Hig, a young pilot who, together with a military survivalist, Bangley, has carved out an efficient but isolated homestead in a brutal post-apocalyptic world until a mysterious radio transmission spurs Hig to venture into the unknown in search of the hope and humanity he still believes exists.',
        type: "ORIENTATION",
        week: 3,
        time: 2
      },
      {
        title: "The Brink Of War | Official Trailer | In Theaters Aug 14 | Angel",
        thumbnail: "https://img.youtube.com/vi/a-T0TlMN-RE/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776419994/The_Brink_Of_War_-_Official_Trailer_-_In_Theaters_Aug_14_-_Angel_cge9ot.mp4",
        description:
          "President Reagan races against time to salvage a deal with Soviet leader Mikhail Gorbachev that could dismantle nuclear arsenals—or ignite disaster. With pressure mounting on all sides, every word spoken brings the world closer to peace… or destruction.",
        type: "BLOG",
        week: null,
        time: 2
      },
      {
        title: "Agefield High: Rock the School – Official Gameplay Overview Trailer",
        thumbnail: "https://img.youtube.com/vi/ClY-3UopEeU/maxresdefault.jpg",
        videoURL:
          "https://res.cloudinary.com/dl0xs7uz9/video/upload/v1776420035/Agefield_High__Rock_the_School_Official_Gameplay_Overview_Trailer_wmhso8.mp4",
        description:
          "See exactly what your circa-2002 high-school day will be like in this gameplay overview trailer for Agefield High: Rock the School, the upcoming Bully-influenced open-world coming-of-age high school game from developer Refugium Games. It's due out for PC (via Steam) in Summer 2026.",
        type: "BLOG",
        week: null,
        time: 12
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
