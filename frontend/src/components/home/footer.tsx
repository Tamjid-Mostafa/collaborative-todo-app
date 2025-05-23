export default function Footer() {
  return (
    <footer className="w-full text-center text-sm text-muted-foreground pt-10">
      © {new Date().getFullYear()} Collaborative ToDo. All rights reserved.
    </footer>
  );
}
