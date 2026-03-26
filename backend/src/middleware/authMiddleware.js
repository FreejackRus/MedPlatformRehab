export function createAuthMiddleware(authService, role) {
  return (req, res, next) => {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const session = authService.getSession(token);
    if (!session) {
      res.status(401).json({ message: "Invalid session" });
      return;
    }

    if (role && session.subject.role !== role) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    req.session = session;
    next();
  };
}
