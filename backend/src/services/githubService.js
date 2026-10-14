import axios from "axios";
import prisma from "../utils/prismaClient.js";
import { decrypt, isEncrypted } from "../utils/encryption.js";

/**
 * Fetch user's GitHub repositories
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Array>} Array of repositories
 */
export const fetchUserRepos = async (accessToken) => {
  try {
    let page = 1;
    let repos = [];
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          sort: "created",
          direction: "desc",
          per_page: 100, // Max repos per page
          page: page
        },
      });

      if (response.data.length === 0) {
        hasMore = false;
      } else {
        repos = repos.concat(response.data);
        if (response.data.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      // Safety break to prevent infinite loops or excessive API usage
      if (page > 5) hasMore = false; // Limit to 500 recently active repos
    }
    return repos;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token is invalid, we don't know whose it is here easily without passing userId,
      // but fetchUserRepos is usually called where we have the user.
      console.error("GitHub Token is invalid (401).");
    }
    console.error("Error fetching user repos:", error.response?.data || error.message);
    throw new Error("Failed to fetch GitHub repositories");
  }
};

/**
 * Fetch commits for a specific repository
 * @param {string} accessToken - GitHub access token
 * @param {string} owner - Repository owner (username or org)
 * @param {string} repo - Repository name
 * @param {Date} since - Date to fetch commits since (optional)
 * @returns {Promise<Array>} Array of commits
 */
export const fetchRepoCommits = async (accessToken, owner, repo, since = null) => {
  try {
    let page = 1;
    let allCommits = [];
    let hasMore = true;

    while (hasMore) {
      const params = {
        per_page: 100,
        page: page
      };

      if (since) {
        params.since = since.toISOString();
      }

      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          params: params,
        }
      );

      if (response.data.length === 0) {
        hasMore = false;
      } else {
        allCommits = allCommits.concat(response.data);
        if (response.data.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      // Limit to 3 pages (300 commits) per repo to avoid rate limits
      if (page > 3) hasMore = false;
    }

    return allCommits;
  } catch (error) {
    // Graceful handling for empty repositories
    if (error.response?.status === 409 || error.response?.data?.message?.includes('empty')) {
      console.warn(`[GITHUB] Skipping empty repository: ${owner}/${repo}`);
      return []; // Return empty array so scan can continue
    }

    console.error(`Error fetching commits for ${owner}/${repo}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch commits for ${owner}/${repo}`);
  }
};

/**
 * Fetch weekly pull requests for a specific repository
 * @param {string} accessToken - GitHub access token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Date} since - Date to fetch PRs since
 * @returns {Promise<Array>} Array of PRs
 */
export const fetchWeeklyPRs = async (accessToken, owner, repo, since = null) => {
  try {
    if (!since) {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      since = date;
    }

    let page = 1;
    let allPRs = [];
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          params: {
            state: "all",
            sort: "created",
            direction: "desc",
            per_page: 100,
            page: page
          },
        }
      );

      // Client-side filtering because GitHub API PR 'since' is tricky
      // If the entire page is older than 'since', we can stop pagination
      let pagePRs = response.data;
      if (pagePRs.length === 0) {
        hasMore = false;
      } else {
        // Check if the oldest PR in this batch is still newer than 'since'
        // Array is sorted descending, so last element is oldest
        const oldestPRDate = new Date(pagePRs[pagePRs.length - 1].created_at);

        // Filter this page
        const relevantPRs = pagePRs.filter(pr =>
          new Date(pr.created_at) >= since || new Date(pr.updated_at) >= since
        );

        allPRs = allPRs.concat(relevantPRs);

        if (response.data.length < 100 || oldestPRDate < since) {
          hasMore = false;
        } else {
          page++;
        }
      }

      if (page > 3) hasMore = false; // Limit to 300 PRs
    }

    return allPRs;
  } catch (error) {
    console.error(`Error fetching PRs for ${owner}/${repo}:`, error.response?.data || error.message);
    return [];
  }
};

/**
 * Fetch closed issues from a repository
 */
export const fetchWeeklyIssues = async (accessToken, owner, repo, since = null) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          state: "closed",
          since: since?.toISOString(),
          sort: "updated",
          direction: "desc",
          per_page: 100,
        },
      }
    );
    // Filter out PRs (GitHub issues API returns both)
    return response.data.filter(issue => !issue.pull_request);
  } catch (error) {
    console.error(`Error fetching issues for ${owner}/${repo}:`, error.message);
    return [];
  }
};

/**
 * Fetch PR review comments
 */
export const fetchRepoReviews = async (accessToken, owner, repo, since = null) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/comments`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          since: since?.toISOString(),
          sort: "created",
          direction: "desc",
          per_page: 100,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for ${owner}/${repo}:`, error.message);
    return [];
  }
};

/**
 * Calculate points for different activity types using weighted "Skill Economy"
 * @param {string} type - Type of activity
 * @param {object} meta - Activity metadata (for impact analysis)
 * @returns {number} Points value
 */
const getActivityPoints = (type, meta = {}) => {
  if (type === 'commit') {
    const msg = (meta.message || '').trim().toLowerCase();

    // 🛡️ ANTI-ABUSE: Block tiny/spammy commit messages
    // Messages like "fix", "update", "temp", "rev", or very short strings are ignored
    if (msg.length < 5 || /^(fix|update|temp|rev|patch|done|test|commit|changes|\.|\!)$/.test(msg)) {
      return 0;
    }

    // 🧱 Skill Economy: Differentiate by impact
    const isLowImpact = /(docs|typo|readme|format|cleanup|style|chore|comment|lint)/.test(msg);
    const isHighImpact = /(feat|fix\s+|implement|refactor|core|breaking|logic|security|auth|api|database)/.test(msg);

    // Reduced base values to prioritize PRs over individual commits
    if (isLowImpact) return 1;
    if (isHighImpact) return 8;
    return 3;
  }

  if (type === 'pr_merged') {
    const changes = (meta.additions || 0) + (meta.deletions || 0);
    // 🛡️ ANTI-ABUSE: Tiny PR Merges (less than 10 lines changed) get significantly less XP
    if (changes < 10 && (meta.changedFiles || 0) < 2) return 30; // Reduced from 150
    return 150;     // HIGH IMPACT: Incentivize quality PR merges
  }

  const pointMap = {
    repo_created: 50,
    pr_opened: 20,
    issue_opened: 5,
    issue_closed: 25,
    review_comment: 15,
  };

  return pointMap[type] || 5;
};

/**
 * Store activity in database (with duplicate prevention)
 * @param {string} userId - User ID
 * @param {string} type - Activity type
 * @param {object} meta - Activity metadata
 * @param {string} podId - Optional pod ID
 * @param {number} multiplier - XP multiplier (e.g. 0.5 for small pods)
 * @returns {Promise<Activity|null>} Created activity or null if duplicate
 */
export const storeActivity = async (userId, type, meta, podId = null, multiplier = 1.0) => {
  // Use the actual activity date if provided in meta, otherwise default to now
  const activityDate = meta.createdAt ? new Date(meta.createdAt) : new Date();

  let existingActivity = null;

  try {
    if (type === "commit" && meta.sha) {
      // Efficient DB lookup using JSON path for SHA
      existingActivity = await prisma.activity.findFirst({
        where: {
          userId,
          type,
          meta: {
            path: ['sha'],
            equals: meta.sha
          }
        }
      });
    } else if (type === "repo_created" && meta.repoFullName) {
      existingActivity = await prisma.activity.findFirst({
        where: {
          userId,
          type,
          meta: {
            path: ['repoFullName'],
            equals: meta.repoFullName
          }
        }
      });
    } else if ((type === "pr_opened" || type === "pr_merged") && meta.prUrl) {
      existingActivity = await prisma.activity.findFirst({
        where: {
          userId,
          type: type,
          meta: { path: ['prUrl'], equals: meta.prUrl }
        }
      });
    } else if (type === "issue_closed" && meta.issueUrl) {
      existingActivity = await prisma.activity.findFirst({
        where: {
          userId,
          type,
          meta: { path: ['issueUrl'], equals: meta.issueUrl }
        }
      });
    } else if (type === "review_comment" && meta.commentId) {
      existingActivity = await prisma.activity.findFirst({
        where: {
          userId,
          type,
          meta: { path: ['commentId'], equals: meta.commentId }
        }
      });
    }

    // If activity already exists, ensure the date is correct (Self-healing)
    if (existingActivity) {
      if (existingActivity.createdAt.getTime() !== activityDate.getTime()) {
        await prisma.activity.update({
          where: { id: existingActivity.id },
          data: { createdAt: activityDate }
        });
      }
      return null; // Skip creation
    }

    // No duplicate found, proceed to create
    let points = Math.floor(getActivityPoints(type, meta) * multiplier);

    // Minimum 1 point if multiplier is applied to a non-zero value
    if (points === 0 && getActivityPoints(type, meta) > 0 && multiplier > 0) {
      points = 1;
    }

    const activity = await prisma.activity.create({
      data: {
        userId,
        type,
        meta,
        value: points,
        podId,
        createdAt: activityDate, // Use the ACTUAL commit/PR date here 🚀
      },
    });

    return activity;

  } catch (error) {
    // If JSON filtering fails (e.g. unsupported DB), fallback to create and ignore unique constraint errors if any
    console.error("Error in storeActivity duplicate check:", error.message);
    // Try to create anyway, it might fail if we had a unique constraint (which we don't yet)
    return null;
  }
};

/**
 * Convert activities to rewards
 * @param {string} userId - User ID
 * @param {Array<Activity>} activities - Array of activities to convert
 * @returns {Promise<Reward>} Created reward
 */
export const convertActivitiesToReward = async (userId, activities) => {
  if (activities.length === 0) {
    return null;
  }

  // Calculate total points
  const totalPoints = activities.reduce((sum, activity) => sum + activity.value, 0);

  // Determine badges based on activity types
  const badges = [];
  const activityTypes = activities.map((a) => a.type);

  if (activityTypes.includes("repo_created")) {
    badges.push("repo-creator");
  }
  if (activityTypes.filter((t) => t === "commit").length >= 10) {
    badges.push("committer");
  }
  if (activityTypes.filter((t) => t === "commit").length >= 50) {
    badges.push("super-committer");
  }

  // Create reward
  const reward = await prisma.reward.create({
    data: {
      userId,
      points: totalPoints,
      badges,
      reason: `GitHub activity sync: ${activities.length} activities`,
    },
  });

  return reward;
};

/**
 * Get authenticated GitHub user info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<object>} User info
 */
export const getGitHubUser = async (accessToken) => {
  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error.response?.data || error.message);
    throw new Error("Failed to fetch GitHub user info");
  }
};

/**
 * Sync GitHub activity for a user
 * @param {string} userId - User ID
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<object>} Sync results
 */
export const syncGitHubActivity = async (userId, accessToken) => {
  const results = {
    reposFetched: 0,
    commitsFetched: 0,
    prsFetched: 0,
    activitiesCreated: 0,
    rewardsCreated: 0,
    errors: [],
  };

  try {
    // 1. Get authenticated user's GitHub username
    const githubUser = await getGitHubUser(accessToken);
    const userLogin = githubUser.login;

    // Mark token as valid if we reach here
    await prisma.user.update({
      where: { id: userId },
      data: { githubTokenValid: true }
    });

    // 2. Fetch user's repositories
    const repos = await fetchUserRepos(accessToken);
    results.reposFetched = repos.length;

    // 2. For each repo, check if it's new (created in last 30 days) and fetch commits
    const syncPeriod = new Date();
    syncPeriod.setDate(syncPeriod.getDate() - 30); // 30 days for general activity sync

    // Define 7-day window for repo creation tracking
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newActivities = [];

    for (const repo of repos) {
      try {
        // Check if repo was created in the last 7 days
        const repoCreatedAt = new Date(repo.created_at);
        if (repoCreatedAt >= sevenDaysAgo) {
          // Store repo creation activity
          const activity = await storeActivity(
            userId,
            "repo_created",
            {
              repoName: repo.name,
              repoFullName: repo.full_name,
              repoUrl: repo.html_url,
              createdAt: repo.created_at,
            }
          );
          if (activity) {
            newActivities.push(activity);
            results.activitiesCreated++;
          }
        }

        // Fetch commits for this repo
        const commits = await fetchRepoCommits(
          accessToken,
          repo.owner.login,
          repo.name,
          syncPeriod
        );

        results.commitsFetched += commits.length;

        // 🛡️ ANTI-ABUSE: Limit how many commits per repo we award points for in a single sync
        // Pushing 50 tiny commits will only reward the first 10, preventing spam.
        let awardedCommitsInBatch = 0;
        const COMMIT_BATCH_CAP = 10;

        // Store commit activities
        for (const commit of commits) {
          const commitAuthor = commit.author?.login || commit.committer?.login;
          if (commitAuthor === userLogin) {
            // Check if we hit the batch cap for this repo
            const shouldAwardPoints = awardedCommitsInBatch < COMMIT_BATCH_CAP;

            const activity = await storeActivity(
              userId,
              "commit",
              {
                sha: commit.sha,
                message: commit.commit.message,
                repoName: repo.name,
                repoFullName: repo.full_name,
                repoUrl: repo.html_url,
                commitUrl: commit.html_url,
                author: commitAuthor,
                createdAt: commit.commit.author.date,
              }
            );

            if (activity) {
              if (shouldAwardPoints) {
                awardedCommitsInBatch++;
              } else {
                // Self-healing: Update activity to have 0 value if cap exceeded
                await prisma.activity.update({
                  where: { id: activity.id },
                  data: { value: 0 }
                });
              }
              newActivities.push(activity);
              results.activitiesCreated++;
            }
          }
        }

        // Fetch PRs
        const prs = await fetchWeeklyPRs(accessToken, repo.owner.login, repo.name, syncPeriod);
        results.prsFetched += prs.length;

        for (const pr of prs) {
          if (pr.user?.login === userLogin) {
            const isMerged = pr.merged_at && new Date(pr.merged_at) >= syncPeriod;
            const isOpened = new Date(pr.created_at) >= syncPeriod;

            if (isOpened) {
              const activity = await storeActivity(userId, "pr_opened", {
                prNumber: pr.number,
                title: pr.title,
                repoName: repo.name,
                repoFullName: repo.full_name,
                prUrl: pr.html_url,
                createdAt: pr.created_at,
              });
              if (activity) {
                newActivities.push(activity);
                results.activitiesCreated++;
              }
            }

            if (isMerged) {
              // 🧪 PROOF OF WORK: Fetch PR details to verify "Minimum Diff Size"
              const prChanges = await fetchPRChanges(accessToken, repo.owner.login, repo.name, pr.number);

              const activity = await storeActivity(userId, "pr_merged", {
                prNumber: pr.number,
                title: pr.title,
                repoName: repo.name,
                repoFullName: repo.full_name,
                prUrl: pr.html_url,
                createdAt: pr.merged_at,
                // Pass diff stats to getActivityPoints for quality gating
                additions: prChanges.additions,
                deletions: prChanges.deletions,
                changedFiles: prChanges.changedFiles
              });
              if (activity) {
                newActivities.push(activity);
                results.activitiesCreated++;
              }
            }
          }
        }

        // Fetch and process Issues
        const issues = await fetchWeeklyIssues(accessToken, repo.owner.login, repo.name, syncPeriod);
        for (const issue of issues) {
          if (issue.closed_by?.login === userLogin) {
            const activity = await storeActivity(userId, "issue_closed", {
              issueNumber: issue.number,
              title: issue.title,
              repoName: repo.name,
              repoFullName: repo.full_name,
              issueUrl: issue.html_url,
              createdAt: issue.closed_at,
            });
            if (activity) {
              newActivities.push(activity);
              results.activitiesCreated++;
            }
          }
        }

        // Fetch and process Reviews
        const reviews = await fetchRepoReviews(accessToken, repo.owner.login, repo.name, syncPeriod);
        for (const review of reviews) {
          if (review.user?.login === userLogin) {
            const activity = await storeActivity(userId, "review_comment", {
              commentId: review.id,
              prUrl: review.pull_request_url,
              repoName: repo.name,
              repoFullName: repo.full_name,
              createdAt: review.created_at,
              message: review.body,
            });
            if (activity) {
              newActivities.push(activity);
              results.activitiesCreated++;
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error processing repo ${repo.full_name}: ${error.message}`);
      }
    }

    // 3. Convert activities to rewards (batch by day or create one reward for all)
    if (newActivities.length > 0) {
      const reward = await convertActivitiesToReward(userId, newActivities);
      if (reward) {
        results.rewardsCreated = 1;
      }
    }

    return results;
  } catch (error) {
    if (error.response?.status === 401) {
      await prisma.user.update({
        where: { id: userId },
        data: { githubTokenValid: false }
      });
    }
    console.error("Error syncing GitHub activity:", error);
    results.errors.push(error.message);
    throw error;
  }
};


/**
 * Sync GitHub activity for a specific repository and pod
 * @param {string} podId - Pod ID
 * @param {string} owner - Repo owner
 * @param {string} repoName - Repo name
 * @returns {Promise<object>} Results
 */
export const syncRepoActivity = async (podId, owner, repoName) => {
  const results = {
    commitsFetched: 0,
    prsFetched: 0,
    activitiesCreated: 0,
    errors: [],
  };

  try {
    // 1. Get the pod to find members (we need to match GitHub usernames to users)
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });

    if (!pod) throw new Error("Pod not found");

    // ANTI-FARMING: Pods with < 3 members get a "Low Velocity" penalty
    const teamSize = pod.members.filter(m => m.status === 'accepted').length;
    const isSmallPod = teamSize < 3;
    if (isSmallPod) {
      results.errors.push(`Team Size (${teamSize}/3): Apply 50% XP penalty to solo farming.`);
    }
    // Note: We might not have an access token here since this is triggered by an admin
    // We can use any member's token or a generic one if configured.
    // For now, we'll try to find an admin with a token.
    const adminWithToken = pod.members.find(m => m.role === 'admin' && m.user.githubToken);
    let accessToken = adminWithToken?.user.githubToken;

    if (!accessToken) {
      // Falling back to public API if possible, or failing
      results.errors.push("No admin with GitHub token found to sync private repos. Trying public fetch.");
    } else {
      // Decrypt if encrypted
      if (isEncrypted(accessToken)) {
        try {
          accessToken = decrypt(accessToken);
        } catch (err) {
          console.error("Failed to decrypt GitHub token:", err.message);
          // fallback to raw or fail?
          results.errors.push("Failed to decrypt admin token.");
          return results;
        }
      }
    }

    const syncWindow = new Date();
    syncWindow.setDate(syncWindow.getDate() - 365); // Fetch last 365 days for pods

    const commits = await fetchRepoCommits(
      accessToken,
      owner,
      repoName,
      syncWindow
    );

    results.commitsFetched = commits.length;

    // 3. For each commit, find the corresponding user in the pod
    // 🛡️ ANTI-ABUSE: Limit how many commits per user we award points for in a single batch
    let commitsByUser = {}; // userId -> count
    const BATCH_COMMIT_CAP = 10;

    for (const commit of commits) {
      const githubLogin = commit.author?.login || commit.committer?.login;
      const authorEmail = commit.commit.author?.email;

      if (!githubLogin && !authorEmail) continue;

      // Find member with this github login OR email
      const member = pod.members.find(m =>
        (githubLogin && m.user.githubUsername === githubLogin) ||
        (authorEmail && m.user.email === authorEmail) ||
        (githubLogin && m.user.name === githubLogin && !m.user.githubUsername)
      );

      if (member) {
        if (!commitsByUser[member.userId]) commitsByUser[member.userId] = 0;
        const shouldAwardPoints = commitsByUser[member.userId] < BATCH_COMMIT_CAP;

        const activity = await storeActivity(
          member.userId,
          "commit",
          {
            sha: commit.sha,
            message: commit.commit.message,
            repoName: repoName,
            repoFullName: `${owner}/${repoName}`,
            repoUrl: commit.html_url.split('/commit/')[0],
            commitUrl: commit.html_url,
            author: githubLogin || authorEmail,
            createdAt: commit.commit.author.date,
          },
          podId,
          isSmallPod ? 0.5 : 1.0
        );

        if (activity) {
          if (shouldAwardPoints) {
            commitsByUser[member.userId]++;
          } else {
            // Self-healing: Set value to 0 if they exceeded the fair-use cap
            await prisma.activity.update({
              where: { id: activity.id },
              data: { value: 0 }
            });
          }
          results.activitiesCreated++;
        }
      }
    }

    // 4. Fetch PRs
    const prs = await fetchWeeklyPRs(accessToken, owner, repoName, syncWindow);
    results.prsFetched = prs.length;

    for (const pr of prs) {
      const githubLogin = pr.user?.login;
      // Note: GitHub PR API doesn't easily expose email of author without extra calls
      if (!githubLogin) continue;

      const member = pod.members.find(m =>
        m.user.githubUsername === githubLogin ||
        (m.user.name === githubLogin && !m.user.githubUsername)
      );
      if (member) {
        // PR Opened
        if (new Date(pr.created_at) >= syncWindow) {
          const activity = await storeActivity(
            member.userId,
            "pr_opened",
            {
              prNumber: pr.number,
              title: pr.title,
              repoName: repoName,
              repoFullName: `${owner}/${repoName}`,
              prUrl: pr.html_url,
              createdAt: pr.created_at,
            },
            podId,
            isSmallPod ? 0.5 : 1.0
          );
          if (activity) results.activitiesCreated++;
        }

        // PR Merged
        if (pr.merged_at && new Date(pr.merged_at) >= syncWindow) {
          // 🧪 PROOF OF WORK: Fetch PR details to verify quality
          const prChanges = await fetchPRChanges(accessToken, owner, repoName, pr.number);

          const activity = await storeActivity(
            member.userId,
            "pr_merged",
            {
              prNumber: pr.number,
              title: pr.title,
              repoName: repoName,
              repoFullName: `${owner}/${repoName}`,
              prUrl: pr.html_url,
              createdAt: pr.merged_at,
              // Pass diff stats to getActivityPoints
              additions: prChanges.additions,
              deletions: prChanges.deletions,
              changedFiles: prChanges.changedFiles
            },
            podId,
            isSmallPod ? 0.5 : 1.0
          );
          if (activity) results.activitiesCreated++;
        }
      }
    }

    return results;
  } catch (error) {
    console.error(`Error syncing repo activity for ${owner}/${repoName}:`, error);
    results.errors.push(error.message);
    return results;
  }
};

/**
 * Analyze user's GitHub profile to detect tech stack and infer role
 * @param {string} userId - User ID
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<object>} Analysis results
 */
export const analyzeAndSaveProfile = async (userId, accessToken, save = true) => {
  try {
    // 1. Fetch Repos using existing helper
    const repos = await fetchUserRepos(accessToken);

    const languageMap = {}; // name -> bytes
    const repoCountMap = {}; // name -> count (for fallback)

    // 2. Fetch Detailed Language Stats for Top 5 Active Repos
    // Sort by updated_at to get recent active work
    const activeRepos = [...repos]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);

    // Process active repos with detailed breakdown
    await Promise.all(activeRepos.map(async (repo) => {
      try {
        const langResponse = await axios.get(repo.languages_url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const langs = langResponse.data;
        Object.entries(langs).forEach(([lang, bytes]) => {
          // Weight bytes by 1 (direct usage) - could add recency multiplier here if needed
          languageMap[lang] = (languageMap[lang] || 0) + bytes;
        });
      } catch (e) {
        console.warn(`Failed to fetch languages for ${repo.full_name}, falling back to primary language`);
        if (repo.language) {
          // Fallback: Assign arbitrary 'bytes' to primary language
          languageMap[repo.language] = (languageMap[repo.language] || 0) + 50000;
        }
      }
    }));

    // Process remaining repos (fallback to primary language to save API calls)
    const processedRepoIds = new Set(activeRepos.map(r => r.id));
    repos.forEach(repo => {
      if (!processedRepoIds.has(repo.id) && repo.language) {
        // Give older/less active repos less weight
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 10000;
      }
    });

    // 3. Determine Top Stack
    const sortedLanguages = Object.entries(languageMap)
      .sort(([, a], [, b]) => b - a)
      .map(([lang]) => lang);

    const topStack = sortedLanguages.slice(0, 15); // Top 15 languages

    // 4. Advanced Role Inference
    const DOMAINS = {
      Frontend: {
        langs: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SASS', 'SCSS', 'Less', 'Vue', 'Svelte', 'CoffeeScript'],
        score: 0
      },
      Backend: {
        langs: ['Java', 'PHP', 'Ruby', 'C#', 'Go', 'Rust', 'Elixir', 'Perl', 'Scala'],
        score: 0
      },
      Mobile: {
        langs: ['Swift', 'Kotlin', 'Dart', 'Objective-C', 'React Native', 'Flutter'], // React Native isn't a lang but appears in topics sometimes, sticking to langs for now
        score: 0
      },
      Data: {
        langs: ['Python', 'R', 'Jupyter Notebook', 'MATLAB', 'Julia', 'SQL'],
        score: 0
      },
      DevOps: {
        langs: ['Shell', 'HCL', 'Dockerfile', 'Makefile', 'PowerShell'],
        score: 0
      },
      Systems: {
        langs: ['C', 'C++', 'Assembly', 'VHDL'],
        score: 0
      }
    };

    // Calculate Domain Scores (Weighted by rank in stack)
    // Top language gets more points than 10th language
    topStack.forEach((lang, index) => {
      const rankWeight = 15 - index; // 15 points for #1, 1 for #15

      // Special Handling: JavaScript/TypeScript/Python are versatile
      if (lang === 'JavaScript' || lang === 'TypeScript') {
        // 🔄 Balancing weights for modern Fullstack development (Node.js, Next.js, etc.)
        DOMAINS.Frontend.score += rankWeight * 0.5;
        DOMAINS.Backend.score += rankWeight * 0.5;
      } else if (lang === 'Python') {
        // Assume 60% Data, 40% Backend
        DOMAINS.Data.score += rankWeight * 0.6;
        DOMAINS.Backend.score += rankWeight * 0.4;
      } else {
        // Check precise lists
        for (const [domain, data] of Object.entries(DOMAINS)) {
          if (data.langs.includes(lang)) {
            data.score += rankWeight;
          }
        }
      }
    });

    // Find Logic
    const sortedDomains = Object.entries(DOMAINS)
      .sort(([, a], [, b]) => b.score - a.score);

    const primaryDomain = sortedDomains[0];   // e.g. ["Frontend", { score: 45 }]
    const secondaryDomain = sortedDomains[1]; // e.g. ["Backend", { score: 30 }]

    let finalRole = 'Developer';

    if (primaryDomain[1].score > 0) {
      // 💡 Lower threshold for Fullstack (if secondary is > 40% of primary)
      if (secondaryDomain[1].score > primaryDomain[1].score * 0.4) {
        // Mixed Role
        if ((primaryDomain[0] === 'Frontend' && secondaryDomain[0] === 'Backend') ||
          (primaryDomain[0] === 'Backend' && secondaryDomain[0] === 'Frontend')) {
          finalRole = 'Fullstack Developer';
        } else {
          finalRole = `${primaryDomain[0]} & ${secondaryDomain[0]} Developer`;
        }
      } else {
        // Strong Primary
        switch (primaryDomain[0]) {
          case 'Data': finalRole = 'Data Scientist/Engineer'; break;
          case 'Mobile': finalRole = 'Mobile App Developer'; break;
          case 'DevOps': finalRole = 'DevOps Engineer'; break;
          case 'Systems': finalRole = 'Systems Engineer'; break;
          default: finalRole = `${primaryDomain[0]} Developer`;
        }
      }
    }

    // 5. Generate Explanation Metadata
    const totalBytes = Object.values(languageMap).reduce((a, b) => a + b, 0) || 1;
    const languageBreakdown = Object.entries(languageMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100)
      }));

    const domainAnalysis = Object.entries(DOMAINS)
      .filter(([, data]) => data.score > 0)
      .sort(([, a], [, b]) => b.score - a.score)
      .map(([name, data]) => ({
        name,
        score: Math.round(data.score)
      }));

    const roleAnalysis = {
      languages: languageBreakdown,
      domains: domainAnalysis,
      reason: `${primaryDomain[0]}-heavy profile detected with over ${languageBreakdown[0]?.percentage || 0}% focus on ${languageBreakdown[0]?.name || 'unknown languages'}.`
    };

    // 6. Update User (Only if save is true)
    if (save) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          techStack: topStack.slice(0, 10),
          inferredRole: finalRole,
          roleAnalysis: roleAnalysis
        }
      });
    }

    return {
      techStack: topStack.slice(0, 10),
      inferredRole: finalRole,
      roleAnalysis: roleAnalysis
    };

  } catch (error) {
    console.error("Error analyzing profile:", error);
    throw new Error("Failed to analyze GitHub profile");
  }
};


/**
 * Fetch the file structure of a repository
 * @param {string} accessToken - GitHub access token
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @returns {Promise<string[]>} List of file paths
 */
export const fetchRepoStructure = async (accessToken, owner, repo) => {
  try {
    // Determine default branch first
    const repoInfo = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const defaultBranch = repoInfo.data.default_branch;

    // Fetch the tree recursively
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data && response.data.tree) {
      // Filter important files and directories (limit depth and exclude node_modules etc)
      return response.data.tree
        .filter(item => {
          const path = item.path;
          // Exclude common junk
          if (path.includes('node_modules') || path.includes('.git/') || path.includes('dist/') || path.includes('build/')) return false;

          // Prioritize root files and config folders
          const depth = path.split('/').length;
          if (depth > 3) return false; // Max depth 3
          return true;
        })
        .map(item => item.path);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching repo structure for ${owner}/${repo}:`, error.message);
    return []; // Graceful degradation
  }
};

/**
 * Fetch PR diff stats (additions/deletions)
 */
export const fetchPRChanges = async (accessToken, owner, repo, number) => {
  try {
    if (!accessToken) return { additions: 0, deletions: 0, changedFiles: 0 };

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return {
      additions: response.data.additions || 0,
      deletions: response.data.deletions || 0,
      changedFiles: response.data.changed_files || 0
    };
  } catch (error) {
    console.warn(`[GITHUB] Error fetching PR diff stats for #${number}:`, error.message);
    return { additions: 0, deletions: 0, changedFiles: 0 };
  }
};

/**
 * Fetch and synthesize deep GitHub Analytics & Technical DNA Intelligence
 * @param {string} username - GitHub username to analyze
 * @param {string} accessToken - Optional GitHub access token for higher rate limits
 * @returns {Promise<object>} Complete developer intelligence dossier
 */
export const fetchDeveloperIntelligenceData = async (username, accessToken = null) => {
  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "CodePods-Analytics-Engine"
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // 1. Fetch GitHub user profile
    const userRes = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
    const user = userRes.data;

    // 2. Fetch public repositories
    const reposRes = await axios.get(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers }
    );
    const repos = reposRes.data || [];

    // 3. Quantitative metrics
    const yearsActive = Math.max(0.1, ((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365.25))).toFixed(1);
    const sourceRepos = repos.filter(r => !r.fork);
    const forkedRepos = repos.filter(r => r.fork);
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const starsPerRepo = (totalStars / Math.max(1, sourceRepos.length)).toFixed(1);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

    // 4. Language Distribution & Bytes Aggregation
    const languageMap = {};
    const topActiveRepos = [...sourceRepos]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    for (const repo of topActiveRepos) {
      if (repo.languages_url) {
        try {
          const langRes = await axios.get(repo.languages_url, { headers, timeout: 4000 });
          Object.entries(langRes.data || {}).forEach(([lang, bytes]) => {
            languageMap[lang] = (languageMap[lang] || 0) + bytes;
          });
        } catch {
          if (repo.language) {
            languageMap[repo.language] = (languageMap[repo.language] || 0) + 30000;
          }
        }
      } else if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 30000;
      }
    }

    // Remaining source repos
    const sampledIds = new Set(topActiveRepos.map(r => r.id));
    sourceRepos.forEach(repo => {
      if (!sampledIds.has(repo.id) && repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 15000;
      }
    });

    const totalBytes = Object.values(languageMap).reduce((a, b) => a + b, 0) || 1;
    const languageColors = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Dart: "#00B4AB",
      Java: "#b07219",
      Go: "#00ADD8",
      Rust: "#dea584",
      Kotlin: "#A97BFF",
      Swift: "#F05138",
      PHP: "#4F5D95",
      Shell: "#89e051",
      Vue: "#41b883",
      C: "#555555",
      "C++": "#f34b7d",
      "C#": "#178600"
    };

    const languageDistribution = Object.entries(languageMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.max(1, Math.round((bytes / totalBytes) * 100)),
        color: languageColors[name] || "#789b73"
      }));

    // Normalize percentages to 100%
    const currentSum = languageDistribution.reduce((acc, item) => acc + item.percentage, 0);
    if (languageDistribution.length > 0 && currentSum !== 100) {
      languageDistribution[0].percentage += (100 - currentSum);
    }

    // 5. Project Scale & Impact Classification
    const notableProjects = [...sourceRepos]
      .sort((a, b) => (b.stargazers_count * 3 + (b.size || 0) / 100) - (a.stargazers_count * 3 + (a.size || 0) / 100))
      .slice(0, 4)
      .map(r => ({
        name: r.name,
        description: r.description || "Public source project with active commit history.",
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language || "TypeScript",
        url: r.html_url,
        updatedAt: r.updated_at
      }));

    // 6. Deterministic Developer Score (0 - 100)
    const tenureScore = Math.min(20, parseFloat(yearsActive) * 4.5);
    const originalityRatio = sourceRepos.length / Math.max(1, repos.length);
    const volumeScore = Math.min(30, originalityRatio * 20 + Math.min(10, sourceRepos.length * 0.4));
    const tractionScore = Math.min(25, (totalStars * 1.5) + (totalForks * 2) + Math.min(10, (user.followers || 0) * 1.2));
    const stackBreadthScore = Math.min(25, languageDistribution.length * 4.5);
    const rawScore = Math.round(tenureScore + volumeScore + tractionScore + stackBreadthScore);
    const developerScore = Math.max(15, Math.min(99, rawScore));

    // 7. Gemini AI Intelligence Synthesis
    let aiIntelligence = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const topLangs = languageDistribution.map(l => `${l.name} (${l.percentage}%)`).join(", ");
        const repoSamples = notableProjects.map(p => `- ${p.name} (${p.language}): ${p.description}`).join("\n");

        const prompt = `
You are an elite Silicon Valley AI Technical Recruiter & Codebase DNA Analyst.
Analyze this GitHub developer and generate a technical DNA profile in strictly valid JSON format.

DEVELOPER DATA:
Name: ${user.name || username}
Username: ${username}
Bio: ${user.bio || "Software Engineer & Builder"}
Location: ${user.location || "Remote"}
Years Active: ${yearsActive}
Developer Score: ${developerScore}/100
Source Repos: ${sourceRepos.length} | Forks: ${forkedRepos.length}
Total Stars: ${totalStars} | Followers: ${user.followers}
Language Distribution: ${topLangs}
Representative Projects:
${repoSamples}

Respond ONLY with valid JSON using this EXACT schema:
{
  "archetype": "string (e.g. 'The Pragmatic Full-Stack Builder', 'The Product Engineer', 'The AI Solutions Pioneer')",
  "archetypeSummary": "string (1 concise punchy sentence defining their engineering ethos)",
  "technicalStrength": "string (2-3 detailed sentences on architectural strengths, core technologies, and execution velocity)",
  "careerTrajectory": "string (2 sentences predicting their next career step and seniority readiness)",
  "strategicGrowthTips": [
    "string (Actionable tip 1, e.g. 'Refine codebase documentation with architecture diagrams.')",
    "string (Actionable tip 2, e.g. 'Explore emerging full-stack frameworks like Next.js 15 or Bun.')",
    "string (Actionable tip 3, e.g. 'Contribute to high-visibility open-source repositories to scale community footprint.')"
  ],
  "recruiterOutlook": "string (Executive summary written for engineering leaders and hiring managers highlighting their standout traits, execution speed, and ideal team fit)"
}
`;

        const geminiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { timeout: 9000 }
        );

        const responseText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiIntelligence = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (aiErr) {
        console.warn("[ANALYTICS] Gemini AI generation error, using heuristic fallback:", aiErr.message);
      }
    }

    // Heuristic Fallback if AI was unavailable or timed out
    if (!aiIntelligence) {
      const primaryLang = languageDistribution[0]?.name || "Full-Stack";
      const secondaryLang = languageDistribution[1]?.name || "Modern Web";

      aiIntelligence = {
        archetype: `${primaryLang} & Product Builder`,
        archetypeSummary: `Prolific builder with ${sourceRepos.length} source repositories and strong passion for ${primaryLang} and modern application design.`,
        technicalStrength: `Demonstrated ability to architect complete applications with high execution velocity in ${primaryLang} and ${secondaryLang}. Shows consistent repository momentum with a strong ratio of original work.`,
        careerTrajectory: `Maturing engineer positioned for rapid advancement into high-impact full-stack and product engineering roles within fast-moving tech ecosystems.`,
        strategicGrowthTips: [
          "Refine codebase documentation and add visual architecture workflows in READMEs.",
          "Explore emerging micro-frameworks and modern edge runtime tooling.",
          "Engage with niche open-source developer communities and submit PRs to large projects.",
          "Integrate automated CI/CD testing workflows across production repositories."
        ],
        recruiterOutlook: `Practical, outcome-driven developer who thrives on shipping end-to-end features independently. Ideal candidate for agile development teams seeking builders who take initiative.`
      };
    }

    return {
      profile: {
        username: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio || "Mobile & Web Developer | React & Firebase Enthusiast | Solving Real-World Problems with AI & Innovation",
        location: user.location || "Remote",
        githubUrl: user.html_url,
        yearsActive: `${yearsActive} Years Active`,
        yearsActiveRaw: parseFloat(yearsActive)
      },
      metrics: {
        developerScore,
        totalStars,
        starsPerRepo: `${starsPerRepo} Stars/Repo`,
        totalRepos: repos.length,
        sourceRepos: sourceRepos.length,
        forkedRepos: forkedRepos.length,
        repoSummary: `${repos.length} (${sourceRepos.length} Source / ${forkedRepos.length} Fork)`,
        totalForks,
        followers: user.followers || 0,
        following: user.following || 0,
        communityRatio: `${user.followers || 0} Followers / ${user.following || 0} Following`
      },
      languageDistribution,
      projectScale: {
        totalSource: sourceRepos.length,
        totalForks: forkedRepos.length,
        notableProjects
      },
      aiIntelligence,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error generating intelligence for ${username}:`, error.message);
    throw error;
  }
};
