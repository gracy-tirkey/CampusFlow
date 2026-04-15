import CareerResource from "../models/CareerResource.js";

// Create career resource
export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      track,
      category,
      content,
      duration,
      difficulty,
      resources: resourceLinks,
      relatedTopics,
    } = req.body;
    const userId = req.user.id;

    const resource = new CareerResource({
      title,
      description,
      track,
      category,
      content,
      duration,
      difficulty,
      resources: resourceLinks,
      relatedTopics,
      createdBy: userId,
    });

    await resource.save();
    res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all resources
export const getAllResources = async (req, res) => {
  try {
    const { track, category, difficulty } = req.query;
    let query = { isActive: true };

    if (track) query.track = track;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const resources = await CareerResource.find(query)
      .populate("createdBy", "name email")
      .sort({ views: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get resources by track
export const getResourcesByTrack = async (req, res) => {
  try {
    const { track } = req.params;

    const resources = await CareerResource.find({
      track,
      isActive: true,
    })
      .populate("createdBy", "name email")
      .sort({ category: 1 });

    const grouped = {};
    resources.forEach((resource) => {
      if (!grouped[resource.category]) {
        grouped[resource.category] = [];
      }
      grouped[resource.category].push(resource);
    });

    res.status(200).json({
      success: true,
      message: "Resources by track retrieved successfully",
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching resources by track",
    });
  }
};

// Get resources by category
export const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const resources = await CareerResource.find({
      category,
      isActive: true,
    })
      .populate("createdBy", "name email")
      .sort({ views: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single resource
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await CareerResource.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("createdBy", "name email");

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCareerPaths = async (req, res) => {
  try {
    const tracks = [
      "MERN Developer",
      "SDE",
      "Data Analyst",
      "UI/UX",
      "DevOps",
      "Cloud Architect",
    ];

    const paths = await Promise.all(
      tracks.map(async (track) => {
        const resources = await CareerResource.find({
          track,
          isActive: true,
        }).limit(5);

        return {
          track,
          resources,
          resourceCount: await CareerResource.countDocuments({
            track,
            isActive: true,
          }),
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: "Career paths retrieved successfully",
      data: paths,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching career paths",
    });
  }
};

// Rate resource
export const rateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const resource = await CareerResource.findById(id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (!resource.rating) {
      resource.rating = {
        average: rating,
        count: 1,
      };
    } else {
      const totalRating =
        resource.rating.average * resource.rating.count + rating;
      resource.rating.count += 1;
      resource.rating.average = totalRating / resource.rating.count;
    }

    await resource.save();

    res.json({
      message: "Resource rated successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update resource
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const resource = await CareerResource.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete resource
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    await CareerResource.findByIdAndUpdate(id, { isActive: false });

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
