===push to github==
  git add -A; if ($?) { git commit -m "chore: update entire system" }; if ($?) { git push origin main }