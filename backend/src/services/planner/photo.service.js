const axios = require("axios");

class PhotoService {
  constructor() {
    this.pexelsKey = process.env.PEXELS_API_KEY;
    this.unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  }

  async getActivityPhoto(keywords, location) {
    let photo = await this.searchPexels(`${keywords} ${location}`);

    if (!photo) {
      photo = await this.searchPexels(keywords);
    }

    if (!photo) {
      photo = await this.searchUnsplash(`${keywords} ${location}`);
    }

    if (!photo) {
      const genericKeyword = this.getGenericKeyword(keywords);
      photo = await this.searchPexels(genericKeyword);
    }

    return photo;
  }

  async searchPexels(query) {
    if (!this.pexelsKey) {
      console.warn("Pexels API key not configured");
      return null;
    }

    try {
      const response = await axios.get("https://api.pexels.com/v1/search", {
        params: {
          query: query,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: this.pexelsKey,
        },
        timeout: 5000,
      });

      const photo = response.data.photos?.[0];
      if (!photo) return null;

      return {
        url: photo.src.large,
        urlSmall: photo.src.medium,
        urlThumb: photo.src.small,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: "Pexels",
        alt: photo.alt || query,
      };
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn("Pexels rate limit reached");
      } else {
        console.error("Pexels search error:", error.message);
      }
      return null;
    }
  }

  async searchUnsplash(query) {
    if (!this.unsplashKey) {
      console.warn("Unsplash API key not configured");
      return null;
    }

    try {
      const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: query,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${this.unsplashKey}`,
        },
        timeout: 5000,
      });

      const photo = response.data.results?.[0];
      if (!photo) return null;

      if (photo.links?.download_location) {
        this.triggerUnsplashDownload(photo.links.download_location).catch(() => {});
      }

      return {
        url: photo.urls.regular,
        urlSmall: photo.urls.small,
        urlThumb: photo.urls.thumb,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        source: "Unsplash",
        alt: photo.alt_description || query,
      };
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn("Unsplash rate limit reached");
      } else {
        console.error("Unsplash search error:", error.message);
      }
      return null;
    }
  }

  async triggerUnsplashDownload(downloadLocation) {
    try {
      await axios.get(downloadLocation, {
        headers: {
          Authorization: `Client-ID ${this.unsplashKey}`,
        },
      });
    } catch (error) {
      console.error("Unsplash download trigger error:", error.message);
    }
  }

  getGenericKeyword(keywords) {
    const keywordMap = {
      pho: "vietnamese food",
      "banh mi": "sandwich vietnam",
      coffee: "cafe vietnam",
      temple: "temple asia",
      pagoda: "pagoda asia",
      museum: "museum interior",
      park: "park nature",
      beach: "beach tropical",
      market: "market asia",
      street: "street asia",
    };

    const lowerKeywords = keywords.toLowerCase();
    for (const [key, value] of Object.entries(keywordMap)) {
      if (lowerKeywords.includes(key)) {
        return value;
      }
    }

    return "vietnam travel";
  }

  async batchFetchPhotos(activities, location) {
    const results = [];

    for (const activity of activities) {
      const photo = await this.getActivityPhoto(activity.photoKeywords || activity.title, location);

      results.push({
        activityId: activity.id || activity.title,
        photo: photo,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }
}

module.exports = new PhotoService();
