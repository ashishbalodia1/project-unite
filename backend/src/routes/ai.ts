import express from "express";
import { summarizeIssue, matchPartners } from "../services/aiService";

const router = express.Router();

/**
 * @swagger
 * /api/ai/summarize:
 *   post:
 *     summary: Summarize an issue using AI
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - severity
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               severity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Issue summary generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/summarize", async (req, res) => {
  try {
    const { id, title, description, category, severity, location, timestamp } = req.body;

    // Validate required fields
    if (!title || !category || severity === undefined) {
      return res.status(400).json({
        error: "Missing required fields: title, category, and severity are required",
      });
    }

    const issue = {
      id: id || Math.random().toString(36).substring(7),
      title,
      description,
      category,
      severity,
      location,
      timestamp: timestamp || new Date().toISOString(),
    };

    const summary = await summarizeIssue(issue);

    res.json({
      summary,
      issue: {
        id: issue.id,
        title: issue.title,
        category: issue.category,
      },
    });
  } catch (error) {
    console.error("Error in /api/ai/summarize:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/ai/match:
 *   post:
 *     summary: Match partners/volunteers for an issue
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - issue
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *               issue:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   category:
 *                     type: string
 *                   severity:
 *                     type: number
 *     responses:
 *       200:
 *         description: Partner matches found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 partners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       matchScore:
 *                         type: number
 *                       reason:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/match", async (req, res) => {
  try {
    const { user, issue } = req.body;

    // Validate required fields
    if (!user || !user.id || !user.name) {
      return res.status(400).json({
        error: "Missing required user fields: id and name are required",
      });
    }

    if (!issue || !issue.title || !issue.category) {
      return res.status(400).json({
        error: "Missing required issue fields: title and category are required",
      });
    }

    const partners = await matchPartners(user, issue);

    res.json({
      partners,
      count: partners.length,
      issue: {
        id: issue.id,
        title: issue.title,
      },
    });
  } catch (error) {
    console.error("Error in /api/ai/match:", error);
    res.status(500).json({
      error: "Failed to match partners",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
