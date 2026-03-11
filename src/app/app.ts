import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <nav class="sidebar">
        <div class="logo-box">
          <div class="logo">
            <span class="logo-text">VITRU</span><span class="logo-star">★</span>
            <span class="logo-sub">EDUCAÇÃO</span>
          </div>
        </div>
        
        <ul class="nav-menu">
          @for (item of menuItems(); track item.label) {
            <li class="nav-item" [class.active]="item.active">
              <a href="#" class="nav-link">
                <i [class]="item.icon"></i>
                <span>{{ item.label }}</span>
                @if (item.hasSubmenu) {
                  <i class="ri-arrow-right-s-line arrow"></i>
                }
              </a>
              @if (item.submenu) {
                <ul class="submenu">
                  @for (sub of item.submenu; track sub.label) {
                    <li><a href="#" class="submenu-link" [routerLink]="sub.link">{{ sub.label }}</a></li>
                  }
                </ul>
              }
            </li>
          }
        </ul>
      </nav>

      <!-- Main Wrapper -->
      <div class="main-wrapper">
        <!-- Topbar -->
        <header class="topbar">
          <div class="topbar-left">
            <button class="menu-toggle">
              <i class="ri-menu-2-fill"></i>
            </button>
            <div class="search-box">
              <i class="ri-search-line"></i>
              <input type="text" placeholder="Pesquisar...">
            </div>
          </div>
          <div class="topbar-right">
            <button class="topbar-btn"><i class="ri-apps-2-line"></i></button>
            <button class="topbar-btn"><i class="ri-fullscreen-line"></i></button>
            <button class="topbar-btn"><i class="ri-moon-line"></i></button>
          </div>
        </header>

        <!-- Content Area -->
        <main class="content">
          <div class="alert-box">
            Página inicial em desenvolvimento!
          </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
          2026 © Vitru.
        </footer>
      </div>

      <!-- Floating Settings Button -->
      <button class="floating-settings">
        <i class="ri-settings-3-fill"></i>
      </button>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background-color: var(--sidebar-bg);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .logo-box {
      height: var(--topbar-height);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      margin-bottom: 20px;
    }

    .logo {
      text-align: center;
      color: white;
    }

    .logo-text {
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 2px;
    }

    .logo-star {
      color: var(--accent-gold);
      font-size: 18px;
      margin-left: 5px;
      vertical-align: super;
    }

    .logo-sub {
      display: block;
      font-size: 10px;
      letter-spacing: 4px;
      margin-top: -5px;
      color: rgba(255, 255, 255, 0.6);
    }

    .nav-menu {
      list-style: none;
      padding: 0 10px;
    }

    .nav-item {
      margin-bottom: 5px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      color: var(--text-sidebar);
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      transition: var(--transition);
    }

    .nav-link i {
      font-size: 18px;
      margin-right: 12px;
    }

    .nav-link span {
      flex-grow: 1;
    }

    .nav-link .arrow {
      font-size: 14px;
      margin-right: 0;
    }

    .nav-link:hover {
      color: var(--text-sidebar-hover);
      background-color: rgba(255, 255, 255, 0.05);
    }

    .nav-item.active .nav-link {
      color: var(--accent-gold);
    }

    .nav-item.active .nav-link i {
      color: var(--accent-gold);
    }

    .submenu {
      list-style: none;
      padding-left: 40px;
      margin-top: 5px;
      margin-bottom: 5px;
      display: none;
    }

    .nav-item:hover .submenu, .nav-item.active .submenu {
      display: block;
    }

    .submenu-link {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 13px;
      display: block;
      padding: 8px 0;
      transition: color 0.2s ease;
    }

    .submenu-link:hover {
      color: var(--accent-gold);
    }

    /* Main Wrapper */
    .main-wrapper {
      margin-left: var(--sidebar-width);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* Topbar */
    .topbar {
      height: var(--topbar-height);
      background-color: var(--topbar-bg);
      box-shadow: var(--shadow);
      padding: 0 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 999;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .menu-toggle {
      background: none;
      border: none;
      font-size: 20px;
      color: var(--text-primary);
      cursor: pointer;
    }

    .search-box {
      position: relative;
      background-color: #f3f3f9;
      border-radius: 6px;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      width: 280px;
    }

    .search-box i {
      color: #878a99;
      margin-right: 10px;
    }

    .search-box input {
      background: none;
      border: none;
      outline: none;
      font-family: inherit;
      font-size: 13px;
      width: 100%;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .topbar-btn {
      background: none;
      border: none;
      font-size: 22px;
      color: #878a99;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: var(--transition);
    }

    .topbar-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
    }

    /* Content */
    .content {
      padding: 24px;
      flex-grow: 1;
    }

    .alert-box {
      background-color: #e1f5fe;
      color: #039be5;
      padding: 15px 20px;
      border-radius: 8px;
      border-left: 5px solid #039be5;
      font-size: 14px;
      font-weight: 500;
    }

    /* Footer */
    .footer {
      padding: 20px 24px;
      font-size: 13px;
      color: #878a99;
      border-top: 1px solid #e9ebec;
      margin-top: auto;
    }

    /* Floating Settings */
    .floating-settings {
      position: fixed;
      bottom: 30px;
      right: 20px;
      width: 45px;
      height: 45px;
      background-color: #212529;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      z-index: 1001;
      animation: rotate 4s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 992px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .main-wrapper {
        margin-left: 0;
      }
    }
  `],
})
export class App {
  protected readonly title = signal('vitru-angular');
  
  protected readonly menuItems = signal([
    { label: 'Início', icon: 'ri-home-4-line', active: true, hasSubmenu: false, submenu: undefined },
    { label: 'AVA', icon: 'ri-dashboard-line', active: false, hasSubmenu: true, submenu: undefined },
    { label: 'Financeiro', icon: 'ri-money-dollar-circle-line', active: false, hasSubmenu: true, submenu: undefined },
    { label: 'Processo Seletivo', icon: 'ri-user-search-line', active: false, hasSubmenu: true, submenu: undefined },
    { label: 'Atendimento', icon: 'ri-customer-service-2-line', active: false, hasSubmenu: true, submenu: undefined },
    { label: 'Acadêmico', icon: 'ri-book-open-line', active: false, hasSubmenu: true, submenu: [{ label: 'Correções por IA', link: '/correcoes-ia' }] },
    { label: 'Integrações', icon: 'ri-links-line', active: false, hasSubmenu: true, submenu: undefined },
    { label: 'Comercial', icon: 'ri-shopping-cart-2-line', active: false, hasSubmenu: true, submenu: undefined },
    { label: 'Gerais', icon: 'ri-settings-4-line', active: false, hasSubmenu: true, submenu: undefined },
  ]);
}
