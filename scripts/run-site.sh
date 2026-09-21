#!/bin/sh

set -u

command_name=${1:-}
site_name=${2:-}
root_dir=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
sites_dir="$root_dir/sites"

usage() {
  if [ "$command_name" = dev ]; then
    echo "Usage: ./dev <site-name>" >&2
  else
    echo "Usage: ./$command_name <site-name|all>" >&2
  fi
  exit 2
}

if [ "$#" -ne 2 ] || [ -z "$site_name" ]; then
  usage
fi

case "$command_name" in
  dev|build|check) ;;
  *) echo "Unknown command: $command_name" >&2; exit 2 ;;
esac

run_site() {
  current_site=$1
  current_dir="$sites_dir/$current_site"

  printf '\n==> %s %s\n' "$command_name" "$current_site"
  if (cd "$current_dir" && npm run "$command_name"); then
    printf 'PASS %s\n' "$current_site"
    return 0
  fi

  printf 'FAIL %s\n' "$current_site" >&2
  return 1
}

if [ "$site_name" = all ]; then
  if [ "$command_name" = dev ]; then
    echo "The dev command requires one site; 'all' is supported only by build and check." >&2
    exit 2
  fi

  found=0
  failed=0
  for site_dir in "$sites_dir"/*; do
    [ -d "$site_dir" ] || continue
    [ -f "$site_dir/package.json" ] || continue
    found=1
    run_site "$(basename "$site_dir")" || failed=1
  done

  if [ "$found" -eq 0 ]; then
    echo "No sites with a package.json were found in $sites_dir." >&2
    exit 2
  fi

  exit "$failed"
fi

case "$site_name" in
  *[!a-z0-9-]*|'')
    echo "Invalid site name '$site_name'. Use a lowercase slug containing letters, numbers, and hyphens." >&2
    exit 2
    ;;
esac

site_dir="$sites_dir/$site_name"
if [ ! -d "$site_dir" ] || [ ! -f "$site_dir/package.json" ]; then
  echo "Unknown site '$site_name'. Expected $site_dir/package.json." >&2
  echo "Available sites:" >&2
  for candidate in "$sites_dir"/*; do
    [ -f "$candidate/package.json" ] && printf '  %s\n' "$(basename "$candidate")" >&2
  done
  exit 2
fi

if [ "$command_name" = dev ]; then
  cd "$site_dir"
  exec npm run dev
fi

run_site "$site_name"
