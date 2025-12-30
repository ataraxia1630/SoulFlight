const CloudinaryService = require("../services/cloudinary.service");

class JournalDTO {
  constructor(journal) {
    this.id = journal.id;
    this.title = journal.title;
    this.content = journal.content || null;

    const images = (journal.images || [])
      .map((img) => ({
        id: img.id,
        public_id: img.url,
        url: CloudinaryService.generateUrl(img.url),
        thumbnail_url: CloudinaryService.generateUrl(img.url, {
          width: 400,
          height: 300,
          crop: "fill",
        }),
        position: img.position,
        is_main: img.is_main,
      }))
      .sort((a, b) => {
        if (a.is_main && !b.is_main) return -1;
        if (!a.is_main && b.is_main) return 1;
        return a.position - b.position;
      });

    this.images = images;
    this.cover_image = images.find((i) => i.is_main)?.url || images[0]?.url || null;

    this.created_at = journal.created_at;
    this.updated_at = journal.updated_at;
  }

  static fromModel(journal) {
    return new JournalDTO(journal);
  }

  static fromList(journals) {
    return journals.map((j) => new JournalDTO(j));
  }
}

module.exports = { JournalDTO };
